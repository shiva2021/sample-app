import * as cdk from "aws-cdk-lib";
import {
  CfnOutput,
  aws_s3 as s3,
  aws_dynamodb as db,
  aws_lambda as lambda,
  aws_lambda_event_sources as eventSources,
} from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SampleAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'SampleAppQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
