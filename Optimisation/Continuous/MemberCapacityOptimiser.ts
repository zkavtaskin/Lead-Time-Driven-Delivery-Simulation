import { TeamConfig } from "../../Simulation/TeamConfig";
import { TeamSimulation } from "../../Simulation/TeamSimulation";
import { BacklogConfig } from "../../Simulation/BacklogConfig";
import { ContinuousResult } from "../Continuous/ContinuousResult"
import * as jsregression from '../../node_modules/js-regression/src/jsregression.js'

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

        let Xy = Array<Array<number>>();
        const model = jsregression.LinearRegression();
        let costPrevious = null;
        while(true) {
            Xy = Xy.concat(this.secondDegreeBatchSamples(2));
            const cost = model.fit(Xy).cost;
            if((costPrevious-cost)/costPrevious < 0.01) {
                break;
            }
            costPrevious = cost;
        }

        //5. Once error is stable find optimal y using gradient descent 
        //return optimal x
        return new ContinuousResult([]);
    }

    private secondDegreeBatchSamples(nBatches : number) : Array<Array<number>> {
        const Xy = Array<Array<number>>()

        for(let i = 0; i < nBatches * (32 * this.teamConfig.Members.length); i++){
            const result = this.secondDegreeSample();
            Xy.push(result);
        }
        return Xy;
    }

    private secondDegreeSample() : Array<number> {
        //need to test clone
        const teamConfigSample = this.teamConfig.ChangeMembersCapacity(this.teamConfig.Members.map((m) => (Math.random() * 5) * m.Capacity));
        const teamSimulation = new TeamSimulation(teamConfigSample, this.backlogConfig, this.effortSize);
        const teamMetrics = teamSimulation.Run();
        const y1 = teamMetrics.Backlog.LeadTime.Max
        const y2 = teamMetrics.Members.reduce((s, m) => s + m.TimeIdle.Median, 0)
        const y = Math.log10(y1 + y2);
        return teamConfigSample.Members.map((m) => m.Capacity).concat(y);
        //chang X to 2 degree polynomial
    }

}