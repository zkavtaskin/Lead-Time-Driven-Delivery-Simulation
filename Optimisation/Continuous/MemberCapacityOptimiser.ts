import { TeamConfig } from "../../Simulation/TeamConfig";
import { TeamSimulation } from "../../Simulation/TeamSimulation";
import { BacklogConfig } from "../../Simulation/BacklogConfig";
import { ContinuousResult } from "../Continuous/ContinuousResult"

export class MemberCapacityOptimiser  {

    private readonly teamConfig : TeamConfig;
    private readonly backlogConfig : BacklogConfig;
    private readonly effortSize : number;

    constructor(teamConfig : TeamConfig, backlogConfig : BacklogConfig, effortSize : number = 0.5) {
        this.teamConfig = teamConfig;
        this.backlogConfig = backlogConfig;
        this.effortSize = effortSize;
    }   

    //reverse engineer 
    //https://github.com/zkavtaskin/Lead-Time-Driven-Delivery-Simulation/blob/master/Notebook/LeadTimeCapacityMinimisation.ipynb
    Optimise() : ContinuousResult {

        let X = Array<Array<number>>(), 
            y = Array<number>();

        //initial seed, 2 batches 
        let results = this.batchSamples(2);
        X = X.concat(results[0]);
        y = y.concat(results[1]);

        //1. Turn X in to a polynomial 
        //2. Use multivariable Linear regression to find the model
        //3. Test the mean error
        //4. Add another sample batch, compare the mean error to see what is the improvement 
        //5. Once error is stable find optimal y using gradient descent 
        //return optimal x
        return new ContinuousResult([]);
    }

    private batchSamples(nBatches : number) : [Array<Array<number>>, Array<number>] {
        const X = Array<Array<number>>(), 
                y = Array<number>();

        for(let i = 0; i < nBatches * (32 * this.teamConfig.Members.length); i++){
            const result = this.randomSample();
            X.push(result[0]);
            y.push(result[1]);
        }
        return [X, y];
    }

    private randomSample() : [Array<number>, number] {
        //need to test clone
        const teamConfigSample = this.teamConfig.ChangeMembersCapacity(this.teamConfig.Members.map((m) => (Math.random() * 5) * m.Capacity));
        const teamSimulation = new TeamSimulation(teamConfigSample, this.backlogConfig, this.effortSize);
        const teamMetrics = teamSimulation.Run();
        const y1 = teamMetrics.Backlog.LeadTime.Max
        const y2 = teamMetrics.Members.reduce((s, m) => s + m.TimeIdle.Median, 0)
        const y = Math.log10(y1 + y2)
        return [teamConfigSample.Members.map((m) => m.Capacity), y];
    }

}