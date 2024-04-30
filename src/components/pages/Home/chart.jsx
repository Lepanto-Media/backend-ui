import { LineChart } from "@mui/x-charts/LineChart";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { tokens } from "../../../theme";
import { Box, Button, Typography, useTheme } from "@mui/material";
export default function Chart(props) {
  const { data, labels, setFrom, setTo, to, from } = props;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          padding: "2em",
          display: "flex",
          flexDirection: {
            sx: "column",
            md: "row",
          },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <span>
            <strong>From</strong>
          </span>
          <DatePicker value={from} onChange={(newVal) => setFrom(newVal)} />
          <span>
            <strong>To</strong>
          </span>
          <DatePicker value={to} onChange={(newVal) => setTo(newVal)} />
        </LocalizationProvider>
        <Button
          sx={{
            background: colors.greenAccent[500],
          }}
        >
          <Typography
            variant="p"
            sx={{ fontWeight: 500, color: "#fff", fontSize: "1.2em" }}
          >
            Export as CSV
          </Typography>
        </Button>
        <Button
          sx={{
            background: colors.greenAccent[500],
          }}
        >
          <Typography
            variant="p"
            sx={{ fontWeight: 500, color: "#fff", fontSize: "1.2em" }}
          >
            Export as json
          </Typography>
        </Button>
        <Button
          sx={{
            background: colors.greenAccent[500],
          }}
        >
          <Typography
            variant="p"
            sx={{ fontWeight: 500, color: "#fff", fontSize: "1.2em" }}
          >
            Export as pdf
          </Typography>
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          padding: "2em",
          display: "flex",
          flexDirection: {
            sx: "column",
            md: "row",
          },
          justifyContent: "space-around",
        }}
      >
        <LineChart
          width={500}
          height={300}
          series={[{ data }]}
          xAxis={[{ scaleType: "point", data: labels }]}
        />
      </Box>
    </>
  );
}
