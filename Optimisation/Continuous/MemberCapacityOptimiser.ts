import { TeamConfig } from "../../Simulation/TeamConfig";
import { TeamSimulation } from "../../Simulation/TeamSimulation";
import { BacklogConfig } from "../../Simulation/BacklogConfig";
import { ContinuousResult } from "../Continuous/ContinuousResult"
import { Statistics } from "../../Simulation/Statistics";
import MLR from "ml-regression-multivariate-linear"
import * as optimize from "optimization-js"

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
        let X = Array<Array<number>>(), 
            Y = Array<Array<number>>(),
            argumentPrevious = new Array(this.teamConfig.Members.length).fill(Number.EPSILON),
            improvingPrecision = false,
            solution = null;

        do {
            const samples = this.secondDegreeBatchSamples(2);
            X = X.concat(samples[0]);
            Y = Y.concat(samples[1]);

            const regression = new MLR(X, Y);
            solution = optimize.minimize_Powell(
                (x) => regression.predict(Statistics.TransformTo2ndDegreePolynomial(x))[0], 
                    new Array(this.teamConfig.Members.length).fill(0)
            );

            improvingPrecision = false;
            for(let i = 0; i < argumentPrevious.length; i++) {
                if(Math.abs(argumentPrevious[i] - solution.argument[i]) / argumentPrevious[i] > 0.10) {
                    improvingPrecision = true;
                    break;
                }
            }
            argumentPrevious = solution.argument;
        } while(improvingPrecision)
        return new ContinuousResult(solution.argument);
    }

    private secondDegreeBatchSamples(nBatches : number) : [Array<Array<number>>, Array<Array<number>>] {
        const X = Array<Array<number>>(), Y =  Array<Array<number>>();
        for(let i = 0; i < nBatches * (32 * this.teamConfig.Members.length); i++){
            const sample = this.secondDegreeSample();
            X.push(sample[0]);
            Y.push(sample[1]);
        }
        return [X, Y];
    }

    private secondDegreeSample() : [Array<number>, Array<number>] {
        const teamConfigSample = this.teamConfig.ChangeMembersCapacity(this.teamConfig.Members.map((m) => (Math.random() * 5) * m.Capacity));
        const teamSimulation = new TeamSimulation(teamConfigSample, this.backlogConfig, this.effortSize);
        const teamMetrics = teamSimulation.Run();
        const Y1 = teamMetrics.Backlog.LeadTime.Max;
        const Y2 = teamMetrics.Members.reduce((s, m) => s + m.TimeIdleData[0], 0);
        const Y = Math.log10(Y1 + Y2);
        const X = Statistics.TransformTo2ndDegreePolynomial(teamConfigSample.Members.map((m) => m.Capacity));
        return [X, [Y]];
    }

}