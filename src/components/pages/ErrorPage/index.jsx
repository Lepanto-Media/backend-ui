import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ErrorPage({ item }) {
  const navigate = useNavigate();
  return (
    <>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="p"
          sx={{
            fontWeight: 400,
            // letterSpacing: "1em",
            fontSize: "10em",
            mt: "-1em",
            fontFamily: "'Bebas Neue', sans-serif",
          }}
        >
          404
        </Typography>
        <Typography
          variant="p"
          sx={{
            fontWeight: 400,

            fontSize: "1.5em",
          }}
        >
          {item} not found.
        </Typography>
        <Typography
          variant="p"
          sx={{
            fontWeight: 400,
            py: "1em",
            fontSize: "1.5em",
          }}
        >
          The {item} you are looking for might have been removed.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
        >
          <Typography
            variant="span"
            sx={{
              fontWeight: 400,
              fontSize: "1.2em",
            }}
          >
            Go Home
          </Typography>
        </Button>
      </Box>
    </>
  );
}

export default ErrorPage;
