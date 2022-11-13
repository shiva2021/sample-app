#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SampleAppStack } from '../lib/sample-app-stack';

const app = new cdk.App();
new SampleAppStack(app, 'SampleAppStack', {
  env: { account: '215534998753', region: 'ap-southeast-2' },
});