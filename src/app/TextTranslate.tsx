"use client";

import { useState, memo, useCallback } from "react";
import { TextField, IconButton, Typography, Box, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const TextTranslate = memo(function TextTranslate() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  const handleSend = useCallback(async () => {
    const trimmed = message.trim();
    if (!trimmed) {
      return;
    }

    setLoading(true);
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed }),
    });
    setLoading(false);

    if (!res.ok) {
      console.error("Failed to fetch data");
      return;
    }

    const data = await res.json();
    console.log("翻译结果：", data);

    if (data[0]?.translations[0]?.text) {
      setResult(data[0].translations[0].text);
    }
    // setMessage("");
  }, [message]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      className="w-full h-full p-2"
    >
      <Box className="w-[46%]">
        <TextField
          placeholder="输入…"
          multiline
          maxRows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          // variant="standard"
          fullWidth
          onKeyDown={handleKeyDown}
        />
      </Box>
      <Box>
        <IconButton onClick={handleSend} color="primary" loading={loading}>
          <SendIcon />
        </IconButton>
      </Box>

      <Box className="w-[50%]">
        <Typography variant="body1" className="!ml-2">
          {result}
        </Typography>
      </Box>
    </Stack>
  );
});

export default TextTranslate;
