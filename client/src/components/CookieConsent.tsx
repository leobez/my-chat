import { useState, useEffect } from "react";
import { Box, Button, Snackbar, Typography } from "@mui/material";

const CookieConsent = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    console.log('consent: ', consent)
    if (!consent || consent === 'denied') {
      setOpen(true);
    }
  }, []);

  const handleConsent = (consent: boolean) => {
    localStorage.setItem("cookieConsent", consent ? "accepted" : "denied");
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      message={
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2">
            Usamos cookies para melhorar sua experiência. Você aceita?
          </Typography>
          <Button color="primary" variant="contained" onClick={() => handleConsent(true)}>
            Aceitar
          </Button>
          <Button color="secondary" variant="outlined" onClick={() => handleConsent(false)}>
            Rejeitar
          </Button>
        </Box>
      }
    />
  );
};

export default CookieConsent;
