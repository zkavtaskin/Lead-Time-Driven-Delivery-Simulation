# Lead Time Driven Delivery Simulation
 
## Introduction
This repository attempts to find optimal team configuration, work size, team member capacity and backlog order to deliver work as fast as possible. This repository comes with experiments for Scrum, Scrum with less handovers, Kanban and Waterfall. 

Download, in Visual Studio Code under Run and Debug press "Run Simulation". Click on debug console, you will see the following output for all experiments:
```
##############################START###################################
###  Small Team Test Experiment

...

# Assumptions
1: Lead Time does NOT follow normal distribution (Nonparametric) => true
2: Cycle Time does NOT follow normal distribution (Nonparametric) => true
3: Two random Lead Time control experiments come from same distribution (Null-Hypothesis is true) => true
4: Team member idle does NOT follow normal distribution (Nonparametric) => true
 

# Control 
  Total mean man-days: original 18.6, actual 18.7
Conditions: 
  Capacity :  PO => Capacity 0.3 Dev => Capacity 1
## Lead Time 
  Days Deviation: 9.8
*When* delivered: 
  First 25% delivered on day 4.75, 50% 8.25, 75% 12, last 25% 31.75
## Cycle Time
  *Time taken* to deliver once started: 
  25% has taken 3 day(s), 50% 5.25, 75% 8.25, last 25% 18.25
## Constraint
  Member: Dev, Idle Deviation: 3.1
## Team Members
 Dev => idle days 1, turn count: waiting 24, preq 3, feedback 0
 PO => idle days 3, turn count: waiting 0, preq 18, feedback 0


# Experiment 
  Total mean man-days: original 23.1, actual 23.7
Conditions: 
  Sort : OrderByLargest
  Capacity : PO => 1, Dev => 3.9
## Lead Time 
  Days Deviation: 11.9
*When* delivered: 
  First 25% delivered on day 0.25, 50% 1.25, 75% 2.75, last 25% 8.75
## Cycle Time
  *Time taken* to deliver once started: 
  25% has taken 0.25 day(s), 50% 0.75, 75% 1.75, last 25% 5
## Constraint
  Member: Dev, Idle Deviation: 0.9
## Team Members
 Dev => idle days 2, turn count: waiting 2, preq 0, feedback 6
 PO => idle days 2, turn count: waiting 0, preq 1, feedback 0


# Control vs Experiment (Null Hypothesis): Significant difference (Rejected)
##############################END###################################
```

## Optimisation methods
[Branch and Bound](https://github.com/zkavtaskin/Lead-Time-Driven-Delivery-Simulation/blob/master/Optimisation/Discrete/Trees.ts) optimisation is used for backlog sort. [Polynomial regression with Powell's method](https://github.com/zkavtaskin/Lead-Time-Driven-Delivery-Simulation/blob/master/Optimisation/Continuous/MemberCapacityOptimiser.ts) is used for team capacity prediction. 


## Customisation
It is possible to setup your own experiments by extending SoftwareTest class like so:

```
export class YourTest extends SoftwareTest {

    public readonly Name: string = "YourTest";

    public readonly Description: string = `Your own simulation`;

    public readonly teamConfig = new TeamConfig([
            new MemberConfig("Product Owner", 10/37, 8/10, 4/100),
            new MemberConfig("UX", 10/37, 4/10, 10/100),
            new MemberConfig("Architecture", 5/37, 5/10, 5/100),
            new MemberConfig("Back-End", 37/37, 8/10, 30/100),
            new MemberConfig("Front-End", 37/37, 8/10, 30/100),
            new MemberConfig("Test", 37/37, 10/10, 20/100),
            new MemberConfig("Product Owner Sign Off", 1/37, 10/10, 1/100)],
        [
                [0, 1/3, 1/10, 1/5,   1/5,   1/5,   0],
                [1, 0,   1/10,   0,   1/3,   1/5,   1/20],
                [1, 1,      0, 1/5,  1/10,    0,   0],
                [1, 0,      1,   0,   1/2,  1/2,   1/20],
                [1, 1,      1,   0,     0,  1/2,   1/20],
                [1, 1,      0,   1,     1,    0,   1/10],
                [0, 0,      0,   0,     0,    1,  0],
        ]
    );
}
```
Then it can be registered in the main.ts:
```
const experiments = new Array<Test>(new SmallTeamTest(), new ScrumTest(), new KanbanTest(), new ScrumPartialStackTest(), new WaterfallExperiment(), new YourTest());
```

## If you made it this far... 
This simulator was built to test assumptions about knowledge work lead time, if you are interested in this consider checking this out:

### Data Science Notebooks

[Exploration of lead time dynamics in Sprint scenario](https://github.com/zkavtaskin/Lead-Time-Driven-Delivery-Simulation/blob/master/Notebook/LeadTimeDynamics.ipynb)

[Lead Time minimisation through team capacity](https://github.com/zkavtaskin/Lead-Time-Driven-Delivery-Simulation/blob/master/Notebook/LeadTimeCapacityMinimisation.ipynb)

### Research

[Research: Rejuvenating Agile operations by putting lead and cycle time front and centre](https://zankavtaskin.medium.com/rejuvenating-agile-operations-by-putting-lead-and-cycle-time-front-and-centre-6a6b52af0b53)

[Lead Time Driven Delivery - Part 0 - Introduction](http://www.zankavtaskin.com/2020/09/lead-time-driven-delivery-introduction.html)

[Lead Time Driven Delivery - Part 1 - Learning to see](http://www.zankavtaskin.com/2020/01/applied-software-delivery-system.html)

[Lead Time Driven Delivery - Part 2 - Learning from data](http://www.zankavtaskin.com/2020/03/lead-time-driven-delivery-metrics.html)

[Lead Time Driven Delivery - Part 3 - Focus on results, not methods](http://www.zankavtaskin.com/2020/08/lead-time-driven-delivery-focus-on.html)

[Lead Time Driven Delivery - Part 4 - Stabilise through embedded testing](http://www.zankavtaskin.com/2020/09/lead-time-driven-delivery-stabilise-and.html)

[Lead Time Driven Delivery - Part 5 -  Practical and closing thoughts](http://www.zankavtaskin.com/2020/09/lead-time-driven-delivery-practical-and.html)



I find this really interesting, if you have any questions about this repository please feel free to contact me. 


