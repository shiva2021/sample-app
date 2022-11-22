import * as cdk from "aws-cdk-lib";
import {
  aws_lambda as lambda,
  Duration,
  aws_events as events,
  aws_events_targets as targets,
  aws_iam as iam,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class SampleAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a lambda function instance
    const lambdaFn = new lambda.Function(this, "s3-file-generator", {
      code: lambda.Code.fromAsset("src"),
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_16_X,
      timeout: Duration.seconds(120),
      memorySize: 1024,
    });

    // create an event rule and add schedular expression
    const eventRule = new events.Rule(this, "lambda-rule", {
      schedule: events.Schedule.expression("cron(0/2 * ? * MON-FRI *)"),
    });

    //create policy rules for S3 bucket
    const s3ListBucketPolicy = new iam.PolicyStatement({
      actions: [
        "s3:*"
      ],
      resources: ["*"],
    });

    //assign an inline policy to the lambda function role
    lambdaFn.role?.attachInlinePolicy(
      new iam.Policy(this, "createBucketPolicy", {
        statements: [s3ListBucketPolicy],
      })
    );

    //Add the lambda function as a target to the event rule
    eventRule.addTarget(new targets.LambdaFunction(lambdaFn));
  }
}
