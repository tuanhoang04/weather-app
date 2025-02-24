import useMediaQuery from "@mui/material/useMediaQuery";
import { LineChart } from "@mui/x-charts/LineChart";
import Chart from "react-apexcharts";

const ResponsiveChart = ({ fourWeekDays, maxTempsByDay, minTempsByDay }) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  console.log(isMobile);
  return (
    <div
      className="chart-container px-2"
      style={{ height: "300px", width: "100%" }}
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
                id: "basic-bar",
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
                showForSingleSeries: false,
                showForNullSeries: true,
                showForZeroSeries: true,
                position: "bottom",
                horizontalAlign: "center",
                floating: false,
                fontSize: "17px",
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
                  size: 7,
                  shape: undefined,
                  strokeWidth: 1,
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
                  borderWidth: 1,
                  borderColor: "#fff",
                  opacity: 0.9,
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
                name: "Maximum temperature",
                data: maxTempsByDay,
              },
              {
                name: "Maximum temperature",
                data: minTempsByDay,
              },
            ]}
            type="line"
            height="302"
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
              label: "Temperature (°C)", // Y-axis label text (e.g., Temperature)
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
        />
      )}
    </div>
  );
};

export default ResponsiveChart;
