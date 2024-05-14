import { LineChart } from "@mui/x-charts/LineChart";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { tokens } from "../../../theme";
import { Box, Button, Typography, useTheme } from "@mui/material";

import exportCSV from "json-to-csv-export";

export default function Chart(props) {
  const { data, labels, setFrom, setTo, to, from } = props;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const csvFilename = "chart_data.csv";
  const csvData = labels?.map((label, index) => ({
    label,
    value: data[index],
  }));

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
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 2,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div>
            <label>From</label>
            <br />
            <DatePicker value={from} onChange={(newVal) => setFrom(newVal)} />
          </div>
          <div>
            <label>To</label>
            <br />
            <DatePicker value={to} onChange={(newVal) => setTo(newVal)} />
          </div>
        </LocalizationProvider>
        <Button
          sx={{ background: colors.greenAccent[500], padding: "15px", marginTop: "20px" }}
          onClick={() =>
            exportCSV({
              data: csvData,
              filename: csvFilename,
              delimiter: ",",
              headers: ["label", "value"],
            })
          }
        >
          <Typography
            variant="p"
            sx={{ fontWeight: 500, color: "#fff", fontSize: "1.2em" }}
          >
            Export as CSV
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
        }}
      >
        <LineChart
          width={1100}
          height={300}
          series={[{ data }]}
          xAxis={[{ scaleType: "point", data: labels }]}
        />
      </Box>
    </>
  );
}
