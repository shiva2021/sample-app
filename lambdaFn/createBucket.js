const { s3Client } = require("./s3Client");
const {
  PutObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand,
  ListObjectsCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
} = require("@aws-sdk/client-s3");

const createBucket = async () => {
  //Create a S3 bucket
  const data = await s3Client.send(
    new CreateBucketCommand({
      Bucket: bucketPramas.Bucket,
    })
  );
  console.log(data);
  console.log("Successfully created a bucket called: ", data.Location);

  //Create an object and upload it to the S3 bucket
  const result = await s3Client.send(new PutObjectCommand(bucketPramas));

  console.log(
    "Successfully created " +
      bucketPramas.Key +
      " and uploaded it to " +
      bucketPramas.Bucket +
      "/" +
      bucketPramas.Key
  );

  console.log(result);
};

(async function () {
  try {
    const bucketPramas = {
      Bucket: "sample-test-bucket-by-shiva2021",
      Key: `string_test.txt`,
      Body: "Hello World",
    };
    try {
      //Check if a bucket already exists
      const exists = new HeadBucketCommand({ Bucket: bucketPramas.Bucket });
      await s3Client.send(exists);
      console.log(`Bucket ${bucketPramas.Bucket} already exists... NOW DELETING in 5 secs`);

      setTimeout(async () => {
        console.log("Deleting the bucket objects");
        const listObjectcommand = new ListObjectsCommand(bucketPramas);
        const { Contents } = await s3Client.send(listObjectcommand);
        if (Contents) {
          for (let obj of Contents) {
            const deleteCommand = new DeleteObjectCommand({
              Bucket: bucketPramas.Bucket,
              Key: obj.Key,
            });

            await s3Client.send(deleteCommand);
          }
        }

        console.log("All the objects have been deleted!");

        console.log("Now deleting the bucket");

        const deleteBucketCommand = new DeleteBucketCommand(bucketPramas);
        const deleteBucketResponse = await s3Client.send(deleteBucketCommand);

        console.log("The bucket has been deleted: ", deleteBucketResponse);
      }, 4000);
    } catch (error) {
      await createBucket();
    }
  } catch (error) {
    console.error(error);
  }
})();
