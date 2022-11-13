import * as cdk from "aws-cdk-lib";
import {
  aws_lambda as lambda,
  Duration,
  aws_events as events,
  aws_events_targets as targets,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class SampleAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const lambdaFn = new lambda.Function(this, "s3-file-generator", {
      code: lambda.Code.fromAsset("lambdaFn"),
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_16_X,
      timeout: Duration.seconds(120),
      memorySize: 1024,
    });

    const eventRule = new events.Rule(this, "lambda-rule", {
      schedule: events.Schedule.cron({ minute: "2" }),
    });

    eventRule.addTarget(new targets.LambdaFunction(lambdaFn));
  }
}
