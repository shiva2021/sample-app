const { s3Client } = require("./s3Client");
const {
  PutObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand,
  ListObjectsCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
} = require("@aws-sdk/client-s3");

const bucketParams = {
  Bucket: "sample-test-bucket-by-shiva2021",
  Key: `string_test.txt`,
  Body: "Hello World",
};

const createBucket = async () => {
  //Create a S3 bucket
  const data = await s3Client.send(
    new CreateBucketCommand({
      Bucket: bucketParams.Bucket,
    })
  );
  console.log(data);
  console.log("Successfully created a bucket called: ", data.Location);

  //Create an object and upload it to the S3 bucket
  const result = await s3Client.send(new PutObjectCommand(bucketParams));

  console.log(
    "Successfully created " +
      bucketParams.Key +
      " and uploaded it to " +
      bucketParams.Bucket +
      "/" +
      bucketParams.Key
  );

  console.log(result);
};

const deleteBucketObjects = async () => {
  console.log("Deleting the bucket objects");
  const listObjectcommand = new ListObjectsCommand(bucketParams);
  const { Contents } = await s3Client.send(listObjectcommand);
  if (Contents) {
    for (let obj of Contents) {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketParams.Bucket,
        Key: obj.Key,
      });

      await s3Client.send(deleteCommand);
    }
  }

  console.log("All the objects have been deleted!");
};

const deleteBucket = async () => {
  console.log(`Now deleting the bucket ${bucketParams.Bucket}`);

  const deleteBucketCommand = new DeleteBucketCommand(bucketParams);
  const deleteBucketResponse = await s3Client.send(deleteBucketCommand);

  console.log(`The bucket ${bucketParams.Bucket} has been deleted: `, deleteBucketResponse);
};

const checkIfBucketExists = async () => {
  const exists = new HeadBucketCommand({ Bucket: bucketParams.Bucket });
  await s3Client.send(exists);
  console.log(`Bucket ${bucketParams.Bucket} already exists... NOW DELETING in 5 secs`);
};

exports.handler = async function () {
  try {
    try {
      await checkIfBucketExists();

      setTimeout(async () => {
        await deleteBucketObjects();
        await deleteBucket();
      }, 4000);

    } catch (error) {
      await createBucket();
    }
  } catch (error) {
    console.error(error);
  }
};
