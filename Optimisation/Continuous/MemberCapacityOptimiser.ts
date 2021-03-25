import { TeamConfig } from "../../Simulation/TeamConfig";
import { TeamSimulation } from "../../Simulation/TeamSimulation";
import { BacklogConfig } from "../../Simulation/BacklogConfig";
import { ContinuousResult } from "../Continuous/ContinuousResult"
import { TeamMetrics } from "../../Simulation/TeamMetrics";
import { MemberConfig } from "../../Simulation/MemberConfig";

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

        const X = Array<Array<number>>(), 
              y = Array<number>();

        //initial seed
        for(let i = 0; i < 2 * (32 * this.teamConfig.Members.length); i++){
            const result = this.randomSample();
            X.push(result[0]);
            y.push(Math.log10(result[1]));
        }

        //1. Turn X in to a polynomial 
        //2. Use multivariable Linear regression to find the model
        //3. Test the mean error
        //4. Add another sample batch, compare the mean error to see what is the improvement 
        //5. Once error is stable find optimal y using gradient descent 
        //return optimal x and y
        return null;
    }

    private randomSample() : [Array<number>, number] {
        //need to test clone
        const teamConfigSample = this.teamConfig.Clone();
        teamConfigSample.Members.forEach((m) => m.Capacity = (Math.random() * 5) * m.Capacity)
        const teamSimulation = new TeamSimulation(teamConfigSample, this.backlogConfig, this.effortSize);
        const teamMetrics = teamSimulation.Run();
        const y1 = teamMetrics.Backlog.LeadTime.Max
        const y2 = teamMetrics.Members.reduce((s, m) => s + m.TimeIdle.Median, 0)
        const y = y1 + y2
        return [teamConfigSample.Members.map((m) => m.Capacity), y];
    }

}