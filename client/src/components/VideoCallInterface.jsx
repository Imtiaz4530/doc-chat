import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import {
  createPeerConnection,
  handleOffer,
  handleAnswer,
  handleIceCandidate,
} from "../../services/webrtcService";

import { Box, Button } from "@mui/material";
import { useStoreState } from "easy-peasy";

// eslint-disable-next-line react/prop-types
const VideoCallInterface = ({ targetUserId }) => {
  const { user } = useStoreState((state) => state.user);
  const [peerConnection, setPeerConnection] = useState(null);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io();

    // Join the specific room for user and doctor
    socketRef.current.emit("joinRoom", {
      userId: user._id,
      doctorId: targetUserId,
    });

    socketRef.current.on("offer", async (payload) => {
      await handleOffer(
        peerConnection,
        payload.offer,
        socketRef.current,
        targetUserId
      );
    });

    socketRef.current.on("answer", async (payload) => {
      await handleAnswer(peerConnection, payload.answer);
    });

    socketRef.current.on("ice-candidate", (incoming) => {
      handleIceCandidate(peerConnection, incoming.candidate);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [peerConnection, targetUserId, user._id]);

  const startCall = async () => {
    const peer = createPeerConnection(socketRef.current, targetUserId);
    setPeerConnection(peer);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideoRef.current.srcObject = stream;
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    socketRef.current.emit("offer", {
      userId: user._id,
      doctorId: targetUserId,
      offer,
    });
  };

  return (
    <Box>
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "100%" }}
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{ width: "100%" }}
      />
      <Button variant="contained" color="primary" onClick={startCall}>
        Start Call
      </Button>
    </Box>
  );
};

export default VideoCallInterface;
