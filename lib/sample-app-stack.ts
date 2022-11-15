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

    // The code that defines your stack goes here
    const lambdaFn = new lambda.Function(this, "s3-file-generator", {
      code: lambda.Code.fromAsset("src"),
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_16_X,
      timeout: Duration.seconds(120),
      memorySize: 1024,
    });

    const eventRule = new events.Rule(this, "lambda-rule", {
      schedule: events.Schedule.expression("cron(0/2 * ? * MON-FRI *)"),
    });

    //create policy rules for lambda function
    const s3ListBucketPolicy = new iam.PolicyStatement({
      actions: ["s3:GetObject", "s3:PutObject", "s3:PutObjectAcl"],
      resources: ['arn:aws:s3:::*'],
    });
    lambdaFn.role?.attachInlinePolicy(
      new iam.Policy(this, 'createBucketPolicy', {
        statements:[s3ListBucketPolicy]
      })
    )

    eventRule.addTarget(new targets.LambdaFunction(lambdaFn));
  }
}
