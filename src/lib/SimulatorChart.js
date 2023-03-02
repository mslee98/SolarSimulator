import { Chart } from 'chart.js/auto';

export class SimulatorChart {
    constructor() {

        /** 주간 일사량 */
        this.weeklyInsolation = document.querySelector('#weeklyInsolation');
        
        /** 발전량 */
        this.dailyPowerGeneration = document.querySelector('#dailyPowerGeneration');

        this.weeklyPowerGeneration = document.querySelector('#weeklyPowerGeneration');

        this.monthlyPowerGeneration = document.querySelector('#monthlyPowerGeneration');

        this.accumulatePowerGeneration = document.querySelector('#accumulatePowerGeneration');

        /** 출력량 */
        this.output = document.querySelector("#output");
        
        /** 지면온도 */
        this.groundTemperature = document.querySelector("#groundTemperature");

        /** 운구량 & 강수량 */
        this.cloudAndPrecipitation = document.querySelector("#cloudAndPrecipitation")

        //테스트용
        this.elNum = 0;

        this.weeklyRandomArr0 = [];
        this.weeklyRandomArr1 = [];

        this.dailyRandomArr = [];

        this.outputArr0 = [];
        this.outputArr1 = [];

        this.groundTemperatureArr0 = [];

        this.cloudAndPrecipitationArr0 = [];
        this.cloudAndPrecipitationArr1 = [];


        this.init();
    }

    init() {

        /** 주간일사량 차트 설정 */
        this.weeklyInsolationCtx = document.getElementById("weeklyInsolation").getContext('2d');

        this.weeklyInsolationGradient = this.weeklyInsolationCtx.createLinearGradient(0, 0, 0, 130);
        this.weeklyInsolationGradient.addColorStop(0,'rgb(28, 117, 0.2)');
        this.weeklyInsolationGradient.addColorStop(0.5,'rgb(28, 117, 56, 0.25)');
        this.weeklyInsolationGradient.addColorStop(1,'rgb(28, 117, 56, 0.1)');

        this.weeklyInsolationConfig = {
            type: 'bar',
            data: {
                labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                datasets:[
                    {
                    labels: 'a',
                    backgroundColor: 'rgb(255, 192, 30)',
                    barThickness: 10,
                    data:[]
                    },
                    {
                    labels: 'b',
                    backgroundColor: 'rgb(31, 203, 79)',
                    barThickness: 10,
                    data:[]
                    }
                ],
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                    }
                }
            }
        } 

        /** 발전량 차트 설정 */
        this.dailyPowerGenerationCtx = document.getElementById("dailyPowerGeneration").getContext('2d');
        this.weeklyPowerGenerationCtx = document.getElementById("weeklyPowerGeneration").getContext('2d');
        this.monthlyPowerGenerationCtx = document.getElementById("monthlyPowerGeneration").getContext('2d');
        this.accumulatePowerGenerationCtx = document.getElementById("accumulatePowerGeneration").getContext('2d');

        this.dailyPowerGenerationGradient = this.dailyPowerGenerationCtx.createLinearGradient(0, 0, 0, 130);
        this.dailyPowerGenerationGradient.addColorStop(0,'rgb(28, 117, 0.2)');
        this.dailyPowerGenerationGradient.addColorStop(0.5,'rgb(28, 117, 56, 0.25)');
        this.dailyPowerGenerationGradient.addColorStop(1,'rgb(28, 117, 56, 0.1)');

        this.weeklyPowerGenerationGradient = this.weeklyPowerGenerationCtx.createLinearGradient(0, 0, 0, 130);
        this.weeklyPowerGenerationGradient.addColorStop(0,'rgb(28, 117, 0.2)');
        this.weeklyPowerGenerationGradient.addColorStop(0.5,'rgb(28, 117, 56, 0.25)');
        this.weeklyPowerGenerationGradient.addColorStop(1,'rgb(28, 117, 56, 0.1)');

        this.monthlyPowerGenerationGradient = this.monthlyPowerGenerationCtx.createLinearGradient(0, 0, 0, 130);
        this.monthlyPowerGenerationGradient.addColorStop(0,'rgb(28, 117, 0.2)');
        this.monthlyPowerGenerationGradient.addColorStop(0.5,'rgb(28, 117, 56, 0.25)');
        this.monthlyPowerGenerationGradient.addColorStop(1,'rgb(28, 117, 56, 0.1)');

        this.accumulatePowerGenerationGradient = this.accumulatePowerGenerationCtx.createLinearGradient(0, 0, 0, 130);
        this.accumulatePowerGenerationGradient.addColorStop(0,'rgb(28, 117, 0.2)');
        this.accumulatePowerGenerationGradient.addColorStop(0.5,'rgb(28, 117, 56, 0.25)');
        this.accumulatePowerGenerationGradient.addColorStop(1,'rgb(28, 117, 56, 0.1)');

        this.dailyPowerGenerationConfig = {
            type: 'line',
            labels: ['08', '16', '24'],
            data: {
                labels: ['', '', '08:00', '', '', '16:00', '', '', '24:00'],
                datasets: [{
                    borderColor: 'rgb(28, 117, 56)',
                    backgroundColor: this.dailyPowerGenerationGradient,
                    fill: true,
                    data: [],
                }]
            },
            options: {
                // responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                elements: {
                    point: {
                        radius: 0
                    }
                }
            }
        }

        this.weeklyPowerGenerationConfig = {
            type: 'line',
            labels: ['10am', '11am', '12am'],
            data: {
                labels: ['10am', '11am', '12am',],
                datasets: [{
                    borderColor: 'rgb(28, 117, 56)',
                    backgroundColor: this.weeklyPowerGenerationGradient,
                    fill: true,
                    data: [ 1,3, 2],
                }]
            },
            options: {
                // responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                elements: {
                    point: {
                        radius: 0
                    }
                }
            }
        }

        this.monthlyPowerGenerationConfig = {
            type: 'line',
            labels: ['10am', '11am', '12am'],
            data: {
                labels: ['10am', '11am', '12am',],
                datasets: [{
                    borderColor: 'rgb(28, 117, 56)',
                    backgroundColor: this.monthlyPowerGenerationGradient,
                    fill: true,
                    data: [ 1,3, 2],
                }]
            },
            options: {
                // responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                elements: {
                    point: {
                        radius: 0
                    }
                }
            }
        }

        this.accumulatePowerGenerationConfig = {
            type: 'line',
            labels: ['10am', '11am', '12am'],
            data: {
                labels: ['10am', '11am', '12am',],
                datasets: [{
                    borderColor: 'rgb(28, 117, 56)',
                    backgroundColor: this.accumulatePowerGenerationGradient,
                    fill: true,
                    data: [ 1,3, 2],
                }]
            },
            options: {
                // responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                elements: {
                    point: {
                        radius: 0
                    }
                }
            }
        }

        /** 출력량 차트 설정 */
        this.outputCtx = document.getElementById("output").getContext('2d');

        this.outputConfig = {
            type: 'line',
            data: {
                labels: ['', '', '08:00', '', '', '16:00', '', '', '24:00'],
                datasets: [
                    {
                        labels: 'Dataset1',
                        data: [],
                        borderColor: 'rgb(255, 192, 30)',
                        backgroundColor: 'rgb(255, 192, 30)',
                        // yAxisID: 'A',
                    },
                    {
                        labels: 'Dataset2',
                        data: [],
                        borderColor: 'rgb(31, 203, 79)',
                        backgroundColor: 'rgb(31, 203, 79)',
                        // yAxisID: 'B'
                    }
                ]
            },
            options: {
                // responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
            }
        }

        /** 지면온도 차트 설정 */
        this.groundTemperatureCtx = document.getElementById("groundTemperature").getContext('2d');

        this.groundTemperatureGradient = this.weeklyInsolationCtx.createLinearGradient(0, 0, 0, 130);
        this.groundTemperatureGradient.addColorStop(0,'rgb(135, 106, 32, 0.2)');
        this.groundTemperatureGradient.addColorStop(0.5,'rgb(135, 106, 32, 0.25)');
        this.groundTemperatureGradient.addColorStop(1,'rgb(135, 106, 32, 0.1)');
        
        this.groundTemperatureConfig = {
            type: 'line',
            // labels: ['10am', '11am', '12am'],
            data: {
                labels: ['', '', '08:00', '', '', '16:00', '', '', '24:00'],
                datasets: [{
                    borderColor: 'rgb(135, 106, 32)',
                    backgroundColor: this.groundTemperatureGradient,
                    fill: true,
                    data: [],
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                elements: {
                    point: {
                        radius: 0
                    }
                }
            }
        }

        /** 운구 * 강수 차트 설정 */
        this.cloudAndPrecipitationCtx = document.getElementById("cloudAndPrecipitation").getContext('2d');

        this.cloudAndPrecipitationConfig = {
            type: 'line',
            data: {
                labels: ['', '', '08:00', '', '', '16:00', '', '', '24:00'],
                datasets: [
                    {
                        labels: 'Dataset1',
                        data: [],
                        borderColor: 'rgb(255, 192, 30)',
                        borderWidth: 2,
                        backgroundColor: 'rgb(255, 192, 30)',
                        lineTension: 0.7
                        // yAxisID: 'A',
                    },
                    {
                        labels: 'Dataset2',
                        data: [],
                        borderColor: 'rgb(31, 203, 79)',
                        borderWidth: 2,
                        backgroundColor: 'rgb(31, 203, 79)',
                        lineTension: 0.7
                        // yAxisID: 'B'
                    }
                ]
            },
            options: {
                // responsive: true,
                // maintainAspectRatio: true,
                bezierCurve: true,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                elements: {
                    point: {
                        radius: 0
                    }
                }
            }
        }

        this.weeklyInsolationChart = new Chart(this.weeklyInsolationCtx, this.weeklyInsolationConfig);
        
        this.dailyPowerGenerationChart = new Chart(this.dailyPowerGenerationCtx, this.dailyPowerGenerationConfig);

        this.weeklyPowerGenerationChart = new Chart(this.weeklyPowerGenerationCtx, this.weeklyPowerGenerationConfig);

        this.monthlyPowerGenerationChart = new Chart(this.monthlyPowerGenerationCtx, this.monthlyPowerGenerationConfig);

        this.accumulatePowerGenerationChart = new Chart(this.accumulatePowerGenerationCtx, this.accumulatePowerGenerationConfig);

        this.outputChart = new Chart(this.outputCtx, this.outputConfig);

        this.groundTemperatureChart = new Chart(this.groundTemperatureCtx, this.groundTemperatureConfig);

        this.cloudAndPrecipitationChart = new Chart(this.cloudAndPrecipitationCtx, this.cloudAndPrecipitationConfig);
    }

    _update(time) {
        
        // console.log(time);

        const elTime = Math.floor(time);//1

        if(this.elNum !== elTime) {
            this.elNum = elTime;
            
            //주간 일사량 Start
            if(this.weeklyRandomArr0.length == 7) {
                console.log("!!");
                this.weeklyInsolationConfig.data.datasets[0].data = this.weeklyRandomArr0;
                this.weeklyInsolationConfig.data.datasets[1].data = this.weeklyRandomArr1;
                
                this.weeklyInsolationChart.update();
                
                this.weeklyRandomArr0 = [];
                this.weeklyRandomArr1 = [];
            } else {
                this.weeklyRandomArr0.push(Math.floor(Math.random() * 10));
                this.weeklyRandomArr1.push(Math.floor(Math.random() * 10));
            }
            //주간 일사량 End

            //예측 발전량 Start
            if(this.dailyRandomArr.length == 9) {
                this.dailyPowerGenerationConfig.data.datasets[0].data = this.dailyRandomArr;

                this.dailyPowerGenerationChart.update();

                const p1 = document.querySelector("#p1");
                const p2 = document.querySelector("#p2");
                const p3 = document.querySelector("#p3");
                const p4 = document.querySelector("#p4");

                p1.innerText = (Math.random() * 2500 + 1500).toFixed(1);
                p2.innerText = (Math.random() * 2500 + 1500).toFixed(1);
                p3.innerText = (Math.random() * 2500 + 1500).toFixed(1);
                p4.innerText = (Math.random() * 2500 + 1500).toFixed(1);

                this.dailyRandomArr = [];
            } else {
                this.dailyRandomArr.push(Math.floor(Math.random() * 3));
            }
            //예측 발전량 End

            // 출력량 Start

            if(this.outputArr0.length == 9) {
                this.outputConfig.data.datasets[0].data = this.outputArr0;
                this.outputConfig.data.datasets[1].data = this.outputArr1;

                
                this.outputChart.update();

                this.outputArr0 = [];
                this.outputArr1 = [];

            } else {
                this.outputArr0.push(Math.floor(Math.random() * 15 + 25));
                this.outputArr1.push(Math.floor(Math.random() * 15 + 25));
            }

            // 출력량 End

            if(this.groundTemperatureArr0.length == 9) {
                this.groundTemperatureConfig.data.datasets[0].data = this.groundTemperatureArr0;
                
                this.groundTemperatureChart.update();

                this.groundTemperatureArr0 = [];

            } else {
                this.groundTemperatureArr0.push(Math.floor(Math.random() * 15 + 25));
            }

            if(this.cloudAndPrecipitationArr0.length == 9) {
                this.cloudAndPrecipitationConfig.data.datasets[0].data = this.cloudAndPrecipitationArr0;
                this.cloudAndPrecipitationConfig.data.datasets[1].data = this.cloudAndPrecipitationArr1;

                
                this.cloudAndPrecipitationChart.update();

                this.cloudAndPrecipitationArr0 = [];
                this.cloudAndPrecipitationArr1 = [];

            } else {
                this.cloudAndPrecipitationArr0.push(Math.floor(Math.random() * 15 + 25));
                this.cloudAndPrecipitationArr1.push(Math.floor(Math.random() * 15 + 25));
            }


        } else {
            console.log("??");
        }

    }

}