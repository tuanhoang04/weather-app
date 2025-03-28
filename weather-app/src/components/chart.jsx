import useMediaQuery from "@mui/material/useMediaQuery";
import { LineChart } from "@mui/x-charts/LineChart";
import Chart from "react-apexcharts";

const ResponsiveChart = ({ fourWeekDays, maxTempsByDay, minTempsByDay }) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  return (
    <div
      className="chart-container px-2"
      style={{ height: "400px", width: "100%" }}
    >
      {isMobile ? (
        // mobile phone chart (linechart from ApexCharts)
        <div
          className="line-chart"
          style={{
            pointerEvents: "none",
          }}
        >
          <Chart
            options={{
              chart: {
                id: "line-chart",
                toolbar: {
                  show: false,
                },
              },
              xaxis: {
                categories: fourWeekDays,
                labels: {
                  style: {
                    colors: "#FFFFFF",
                    fontSize: "13px",
                  },
                },
              },
              yaxis: {
                labels: {
                  style: {
                    colors: "#FFFFFF",
                    fontSize: "13px",
                  },
                },
              },
              colors: ["#e15759", "#4e79a7"],
              legend: {
                show: true,
                showForSingleSeries: true,
                showForNullSeries: true,
                showForZeroSeries: true,
                shape: "square",
                position: "bottom",
                horizontalAlign: "center",
                floating: false,
                fontSize: "15px",
                fontFamily: "Roboto, sans-serif",
                fontWeight: "light",
                formatter: undefined,
                inverseOrder: false,
                width: undefined,
                height: undefined,
                tooltipHoverFormatter: undefined,
                customLegendItems: [],
                clusterGroupedSeries: true,
                clusterGroupedSeriesOrientation: "vertical",
                offsetX: 0,
                offsetY: 0,
                labels: {
                  colors: "#FFFFFF",
                  useSeriesColors: false,
                },
                markers: {
                  size: 6,
                  shape: "square",
                  strokeWidth: 0.7,
                  fillColors: undefined,
                  customHTML: undefined,
                  onClick: undefined,
                  offsetX: 0,
                  offsetY: 0,
                },
                itemMargin: {
                  horizontal: 5,
                  vertical: 0,
                },
                onItemClick: {
                  toggleDataSeries: true,
                },
                onItemHover: {
                  highlightDataSeries: true,
                },
              },
              dataLabels: {
                enabled: true,
                enabledOnSeries: undefined,
                formatter: function (val, opts) {
                  return val;
                },
                textAnchor: "middle",
                distributed: false,
                offsetX: 0,
                offsetY: 0,
                style: {
                  fontSize: "13px",
                  fontFamily: "Roboto, sans-serif",
                  fontWeight: "medium",
                  colors: undefined,
                },
                background: {
                  enabled: true,
                  foreColor: "#fff",
                  padding: 4,
                  borderRadius: 2,
                  borderWidth: 0.5,
                  borderColor: "#fff",
                  opacity: 0.8,
                  dropShadow: {
                    enabled: false,
                    top: 1,
                    left: 1,
                    blur: 1,
                    color: "#000",
                    opacity: 0.45,
                  },
                },
              },
            }}
            series={[
              {
                name: "Maximum Temperature",
                data: maxTempsByDay,
              },
              {
                name: "Minimum Temperature",
                data: minTempsByDay,
              },
            ]}
            type="line"
            height="400"
          />
        </div>
      ) : (
        // desktop chart (LineChart from mui-charts)
        <LineChart
          xAxis={[
            {
              data: fourWeekDays,
              scaleType: "band",
            },
          ]}
          yAxis={[
            {
              label: "Temperature (°C)",
            },
          ]}
          series={[
            {
              data: maxTempsByDay,
              label: "Maximum Temperature",
              curve: "linear",
              color: "#e15759",
            },
            {
              data: minTempsByDay,
              label: "Minimum Temperature",
              curve: "linear",
              color: "#4e79a7",
            },
          ]}
          sx={{
            "& .MuiChartsAxis-tickLabel tspan": { fontSize: "14px" },
            "& g.MuiChartsAxis-label": { margin: "15px" },
          }}
        />
      )}
    </div>
  );
};

export default ResponsiveChart;
