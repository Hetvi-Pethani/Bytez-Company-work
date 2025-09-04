import Header from "../Header/header";
import React from "react";
import Chart from "react-apexcharts";
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";


const Banner = () => {

    const navigate = useNavigate();


    useEffect(() => {

        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/')
        }
        if (token) {
            navigate('/banner')
           
        }
    }, [navigate])


    const VisitorChart = () => {
        const chartOptions = {
            chart: {
                type: "area",
                toolbar: { show: false },
            },
            colors: ["#3182CE", "#38B2AC"], // Blue and Green colors
            dataLabels: { enabled: false },
            stroke: { curve: "smooth", width: 2 },
            fill: { type: "gradient", gradient: { shadeIntensity: 0.5, opacityFrom: 0.6, opacityTo: 0.1 } },
            xaxis: {
                categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                labels: { style: { colors: "#6B7280", fontSize: "12px" } },
            },
            yaxis: { labels: { style: { colors: "#6B7280", fontSize: "12px" } } },
            tooltip: { shared: true, intersect: false },
            legend: { position: "top", horizontalAlign: "right" },
        };

        const chartSeries = [
            { name: "Page Views", data: [30, 40, 35, 50, 49, 60, 70] },
            { name: "Sessions", data: [20, 32, 28, 40, 36, 50, 65] },
        ];

        return (
            <div className="card p-4 shadow-lg">
                <Chart options={chartOptions} series={chartSeries} type="area" height={350} />
            </div>
        );
    };

    const IncomeOverviewChart = () => {

        const chartOptions = {
            chart: { type: "bar", toolbar: { show: false } },
            colors: ["#06B6D4"], // Cyan color for bars
            plotOptions: {
                bar: { columnWidth: "55%", borderRadius: 4 },
            },
            dataLabels: { enabled: false },
            xaxis: {
                categories: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
                labels: { style: { colors: "#6B7280", fontSize: "12px" } },
            },
            yaxis: { labels: { style: { colors: "#6B7280", fontSize: "12px" } } },
            tooltip: { enabled: true },
        };

        const chartSeries = [{ name: "Income", data: [760, 1150, 800, 550, 900, 650, 1000] }];

        return (
            <div id="income-overview-chart">
                <Chart options={chartOptions} series={chartSeries} type="bar" height={250} />
            </div>
        )
    }

    const AnalyticsReportChart = () => {
        const chartOptions = {
            chart: {
                type: "line",
                toolbar: { show: false },
            },
            colors: ["#F59E0B"], // Yellow/Orange color
            stroke: {
                curve: "smooth",
                width: 2,
            },
            xaxis: {
                categories: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                labels: { style: { colors: "#6B7280", fontSize: "12px" } },
            },
            yaxis: {
                labels: { style: { colors: "#6B7280", fontSize: "12px" } },
            },
            tooltip: { enabled: true },
            grid: { show: true, borderColor: "#E5E7EB", strokeDashArray: 4 },
        };

        const chartSeries = [{ name: "Finance Growth", data: [50, 90, 40, 80, 60, 30, 55] }];

        return (
            <div id="analytics-report-chart">
                <Chart options={chartOptions} series={chartSeries} type="line" height={400} />
            </div>
        )
    }

    const SalesReportChart = () => {
        const chartOptions = {
            chart: { type: "bar", toolbar: { show: false } },
            colors: ["#F59E0B", "#3B82F6"], // Yellow for Net Profit, Blue for Revenue
            plotOptions: {
                bar: { columnWidth: "20%", borderRadius: 6 },
            },
            dataLabels: { enabled: false },
            xaxis: {
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                labels: { style: { colors: "#6B7280", fontSize: "12px", padding: 5 } },
            },
            yaxis: { labels: { style: { colors: "#6B7280", fontSize: "12px" } } },
            tooltip: { enabled: true },
            legend: { position: "top", markers: { radius: 4 } },
            grid: { show: true, borderColor: "#E5E7EB", strokeDashArray: 4 },
        };

        const chartSeries = [

            { name: "Net Profit", data: [180, 90, 140, 110, 120, 150] },
            { name: "Revenue", data: [120, 50, 90, 150, 170, 100] },
        ];
        return (
            <div id="sales-report-chart">
                <Chart options={chartOptions} series={chartSeries} type="bar" height={430} />
            </div>
        )
    }






    return (

        <div>
            <Header />
            <div className="pc-container">
                <div className="pc-content">
                    {/* [ breadcrumb ] start */}
                    <div className="page-header">
                        <div className="page-block">
                            <div className="row align-items-center">
                                <div className="col-md-12">
                                    <div className="page-header-title">
                                        <h5 className="m-b-10">Home</h5>
                                    </div>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="../dashboard/index.html">Home</a></li>
                                        <li className="breadcrumb-item"><a href="javascript: void(0)">Dashboard</a></li>
                                        <li className="breadcrumb-item" aria-current="page">Home</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* [ breadcrumb ] end */}
                    {/* [ Main Content ] start */}
                    <div className="row">
                        {/* [ sample-page ] start */}
                        <div className="col-md-6 col-xl-3">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="mb-2 f-w-400 text-muted">Total Page Views</h6>
                                    <h4 className="mb-3">4,42,236 <span className="badge bg-light-primary border border-primary"><i className="ti ti-trending-up" /> 59.3%</span></h4>
                                    <p className="mb-0 text-muted text-sm">You made an extra <span className="text-primary">35,000</span> this year
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-3">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="mb-2 f-w-400 text-muted">Total Users</h6>
                                    <h4 className="mb-3">78,250 <span className="badge bg-light-success border border-success"><i className="ti ti-trending-up" /> 70.5%</span></h4>
                                    <p className="mb-0 text-muted text-sm">You made an extra <span className="text-success">8,900</span>
                                        this year</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-3">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="mb-2 f-w-400 text-muted">Total Order</h6>
                                    <h4 className="mb-3">18,800 <span className="badge bg-light-warning border border-warning"><i className="ti ti-trending-down" /> 27.4%</span></h4>
                                    <p className="mb-0 text-muted text-sm">You made an extra <span className="text-warning">1,943</span>
                                        this year</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-3">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="mb-2 f-w-400 text-muted">Total Sales</h6>
                                    <h4 className="mb-3">$35,078 <span className="badge bg-light-danger border border-danger"><i className="ti ti-trending-down" /> 27.4%</span></h4>
                                    <p className="mb-0 text-muted text-sm">You made an extra <span className="text-danger">$20,395</span> this year
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 col-xl-8">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h5 className="mb-0">Unique Visitor</h5>
                                <ul className="nav nav-pills justify-content-end mb-0" id="chart-tab-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="chart-tab-home-tab" data-bs-toggle="pill" data-bs-target="#chart-tab-home" type="button" role="tab" aria-controls="chart-tab-home" aria-selected="true">Month</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link active" id="chart-tab-profile-tab" data-bs-toggle="pill" data-bs-target="#chart-tab-profile" type="button" role="tab" aria-controls="chart-tab-profile" aria-selected="false">Week</button>
                                    </li>
                                </ul>
                            </div>

                            <div className="mx-auto">
                                <VisitorChart />
                            </div>

                        </div>
                        <div className="col-md-12 col-xl-4">
                            <h5 className="mb-3">Income Overview</h5>
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="mb-2 f-w-400 text-muted">This Week Statistics</h6>
                                    <h3 className="mb-3">$7,650</h3>
                                    <div className=" mx-auto ">
                                        <IncomeOverviewChart />
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-md-12 col-xl-8">
                            <h5 className="mb-3">Recent Orders</h5>
                            <div className="card tbl-card">
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-hover table-borderless mb-0">
                                            <thead>
                                                <tr>
                                                    <th>TRACKING NO.</th>
                                                    <th>PRODUCT NAME</th>
                                                    <th>TOTAL ORDER</th>
                                                    <th>STATUS</th>
                                                    <th className="text-end">TOTAL AMOUNT</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><a href="#" className="text-muted">84564564</a></td>
                                                    <td>Camera Lens</td>
                                                    <td>40</td>
                                                    <td><span className="d-flex align-items-center gap-2"><i className="fas fa-circle text-danger f-10 m-r-5" />Rejected</span>
                                                    </td>
                                                    <td className="text-end">$40,570</td>
                                                </tr>
                                                <tr>
                                                    <td><a href="#" className="text-muted">84564564</a></td>
                                                    <td>Laptop</td>
                                                    <td>300</td>
                                                    <td><span className="d-flex align-items-center gap-2"><i className="fas fa-circle text-warning f-10 m-r-5" />Pending</span>
                                                    </td>
                                                    <td className="text-end">$180,139</td>
                                                </tr>
                                                <tr>
                                                    <td><a href="#" className="text-muted">84564564</a></td>
                                                    <td>Mobile</td>
                                                    <td>355</td>
                                                    <td><span className="d-flex align-items-center gap-2"><i className="fas fa-circle text-success f-10 m-r-5" />Approved</span>
                                                    </td>
                                                    <td className="text-end">$180,139</td>
                                                </tr>
                                                <tr>
                                                    <td><a href="#" className="text-muted">84564564</a></td>
                                                    <td>Camera Lens</td>
                                                    <td>40</td>
                                                    <td><span className="d-flex align-items-center gap-2"><i className="fas fa-circle text-danger f-10 m-r-5" />Rejected</span>
                                                    </td>
                                                    <td className="text-end">$40,570</td>
                                                </tr>
                                                <tr>
                                                    <td><a href="#" className="text-muted">84564564</a></td>
                                                    <td>Laptop</td>
                                                    <td>300</td>
                                                    <td><span className="d-flex align-items-center gap-2"><i className="fas fa-circle text-warning f-10 m-r-5" />Pending</span>
                                                    </td>
                                                    <td className="text-end">$180,139</td>
                                                </tr>
                                                <tr>
                                                    <td><a href="#" className="text-muted">84564564</a></td>
                                                    <td>Mobile</td>
                                                    <td>355</td>
                                                    <td><span className="d-flex align-items-center gap-2"><i className="fas fa-circle text-success f-10 m-r-5" />Approved</span>
                                                    </td>
                                                    <td className="text-end">$180,139</td>
                                                </tr>
                                                <tr>
                                                    <td><a href="#" className="text-muted">84564564</a></td>
                                                    <td>Camera Lens</td>
                                                    <td>40</td>
                                                    <td><span className="d-flex align-items-center gap-2"><i className="fas fa-circle text-danger f-10 m-r-5" />Rejected</span>
                                                    </td>
                                                    <td className="text-end">$40,570</td>
                                                </tr>
                                                <tr>
                                                    <td><a href="#" className="text-muted">84564564</a></td>
                                                    <td>Laptop</td>
                                                    <td>300</td>
                                                    <td><span className="d-flex align-items-center gap-2"><i className="fas fa-circle text-warning f-10 m-r-5" />Pending</span>
                                                    </td>
                                                    <td className="text-end">$180,139</td>
                                                </tr>
                                                <tr>
                                                    <td><a href="#" className="text-muted">84564564</a></td>
                                                    <td>Mobile</td>
                                                    <td>355</td>
                                                    <td><span className="d-flex align-items-center gap-2"><i className="fas fa-circle text-success f-10 m-r-5" />Approved</span>
                                                    </td>
                                                    <td className="text-end">$180,139</td>
                                                </tr>
                                                <tr>
                                                    <td><a href="#" className="text-muted">84564564</a></td>
                                                    <td>Mobile</td>
                                                    <td>355</td>
                                                    <td><span className="d-flex align-items-center gap-2"><i className="fas fa-circle text-success f-10 m-r-5" />Approved</span>
                                                    </td>
                                                    <td className="text-end">$180,139</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 col-xl-4">
                            <h5 className="mb-3">Analytics Report</h5>
                            <div className="card">
                                <div className="list-group list-group-flush">
                                    <a href="#" className="list-group-item list-group-item-action d-flex align-items-center justify-content-between">Company
                                        Finance Growth<span className="h5 mb-0">+45.14%</span></a>
                                    <a href="#" className="list-group-item list-group-item-action d-flex align-items-center justify-content-between">Company
                                        Expenses Ratio<span className="h5 mb-0">0.58%</span></a>
                                    <a href="#" className="list-group-item list-group-item-action d-flex align-items-center justify-content-between">Business
                                        Risk Cases<span className="h5 mb-0">Low</span></a>
                                </div>
                                <div className="container mx-auto">
                                    <AnalyticsReportChart />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 col-xl-8">
                            <h5 className="mb-3">Sales Report</h5>
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="mb-2 f-w-400 text-muted">This Week Statistics</h6>
                                    <h3 className="mb-0">$7,650</h3>
                                </div>
                                <div className="container mx-auto">
                                    <SalesReportChart />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 col-xl-4">
                            <h5 className="mb-3">Transaction History</h5>
                            <div className="card">
                                <div className="list-group list-group-flush">
                                    <a href="#" className="list-group-item list-group-item-action">
                                        <div className="d-flex">
                                            <div className="flex-shrink-0">
                                                <div className="avtar avtar-s rounded-circle text-success bg-light-success">
                                                    <i className="ti ti-gift f-18" />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-1">Order #002434</h6>
                                                <p className="mb-0 text-muted">Today, 2:00 AM</p>
                                            </div>
                                            <div className="flex-shrink-0 text-end">
                                                <h6 className="mb-1">+ $1,430</h6>
                                                <p className="mb-0 text-muted">78%</p>
                                            </div>
                                        </div>
                                    </a>
                                    <a href="#" className="list-group-item list-group-item-action">
                                        <div className="d-flex">
                                            <div className="flex-shrink-0">
                                                <div className="avtar avtar-s rounded-circle text-primary bg-light-primary">
                                                    <i className="ti ti-message-circle f-18" />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-1">Order #984947</h6>
                                                <p className="mb-0 text-muted">5 August, 1:45 PM</p>
                                            </div>
                                            <div className="flex-shrink-0 text-end">
                                                <h6 className="mb-1">- $302</h6>
                                                <p className="mb-0 text-muted">8%</p>
                                            </div>
                                        </div>
                                    </a>
                                    <a href="#" className="list-group-item list-group-item-action">
                                        <div className="d-flex">
                                            <div className="flex-shrink-0">
                                                <div className="avtar avtar-s rounded-circle text-danger bg-light-danger">
                                                    <i className="ti ti-settings f-18" />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-1">Order #988784</h6>
                                                <p className="mb-0 text-muted">7 hours ago</p>
                                            </div>
                                            <div className="flex-shrink-0 text-end">
                                                <h6 className="mb-1">- $682</h6>
                                                <p className="mb-0 text-muted">16%</p>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* [ Main Content ] end */}
            <footer className="pc-footer">
                <div className="footer-wrapper container-fluid">
                    <div className="row">
                        <div className="col-sm my-1">
                            <p className="m-0">Mantis ♥ crafted by Team <a href="https://themeforest.net/user/codedthemes" target="_blank">Codedthemes</a></p>
                        </div>
                        <div className="col-auto my-1">
                            <ul className="list-inline footer-link mb-0">
                                <li className="list-inline-item"><a href="../index.html">Home</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    )
}

export default Banner;

