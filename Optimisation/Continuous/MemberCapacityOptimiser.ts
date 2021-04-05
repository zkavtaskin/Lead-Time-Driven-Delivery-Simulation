import { TeamConfig } from "../../Simulation/TeamConfig";
import { TeamSimulation } from "../../Simulation/TeamSimulation";
import { BacklogConfig } from "../../Simulation/BacklogConfig";
import { ContinuousResult } from "../Continuous/ContinuousResult"
import * as jsregression from '../../node_modules/js-regression/src/jsregression.js'
import { Statistics } from "../../Simulation/Statistics";
import { mode } from "simple-statistics";


/* 
Using 
https://github.com/zkavtaskin/Lead-Time-Driven-Delivery-Simulation/blob/master/Notebook/LeadTimeCapacityMinimisation.ipynb
as the basis
*/
export class MemberCapacityOptimiser  {

    private readonly teamConfig : TeamConfig;
    private readonly backlogConfig : BacklogConfig;
    private readonly effortSize : number;

    constructor(teamConfig : TeamConfig, backlogConfig : BacklogConfig, effortSize : number = 0.5) {
        this.teamConfig = teamConfig;
        this.backlogConfig = backlogConfig;
        this.effortSize = effortSize;
    }   

    Optimise() : ContinuousResult {
        let Xy = Array<Array<number>>(), X = Array<Array<number>>();
        const model = jsregression.LinearRegression();
        let rmsePrevious = null;
        while(true) {
            const samples = this.secondDegreeBatchSamples(1);
            X = X.concat(samples[0]);
            Xy = Xy.concat(samples[1]);
            model.fit(Xy);
            const yPredicted = model.transform(X);
            const rmse = Math.sqrt(Statistics.MeanSquaredError(Xy.map(x => x[Xy.length-1]), yPredicted));
            //gains check
            if((rmsePrevious-rmse)/rmsePrevious < 0.01) {
                break;
            }
            rmsePrevious = rmse;
        }

        //5. Once error is stable find optimal y using gradient descent 
        //return optimal x
        return new ContinuousResult([]);
    }

    private secondDegreeBatchSamples(nBatches : number) : [Array<Array<number>>, Array<Array<number>>] {
        const Xy = Array<Array<number>>(), X =  Array<Array<number>>();
        for(let i = 0; i < nBatches * (32 * this.teamConfig.Members.length); i++){
            const sample = this.secondDegreeSample();
            X.push(sample[0]);
            Xy.push(sample[1]);
        }
        return [X, Xy];
    }

    private secondDegreeSample() : [Array<number>, Array<number>] {
        //need to test clone
        const teamConfigSample = this.teamConfig.ChangeMembersCapacity(this.teamConfig.Members.map((m) => (Math.random() * 5) * m.Capacity));
        const teamSimulation = new TeamSimulation(teamConfigSample, this.backlogConfig, this.effortSize);
        const teamMetrics = teamSimulation.Run();
        const y1 = teamMetrics.Backlog.LeadTime.Max;
        const y2 = teamMetrics.Members.reduce((s, m) => s + m.TimeIdle.Median, 0);
        const y = Math.log10(y1 + y2);
        const X = Statistics.TransformTo2ndDegreePolynomial(teamConfigSample.Members.map((m) => m.Capacity));
        const Xy = X.concat(y);
        return [X, Xy];
    }

}