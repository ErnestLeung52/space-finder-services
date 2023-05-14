// import { Stack, StackProps } from 'aws-cdk-lib';
// import { AttributeType, ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
// import { Construct } from 'constructs';
// import { getSuffixFromStack } from '../Utils';

// export class DataStack extends Stack {
// 	public readonly spacesTable: ITable;

// 	constructor(scope: Construct, id: string, props?: StackProps) {
// 		super(scope, id, props);

// 		const suffix = getSuffixFromStack(this);

// 		this.spacesTable = new Table(this, 'SpacesTable', {
// 			partitionKey: {
// 				name: 'id',
// 				type: AttributeType.STRING,
// 			},
// 			tableName: `SpaceTable-${suffix}`,
// 		});
// 	}
// }

import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../Utils';
import { Bucket, BucketAccessControl, HttpMethods, IBucket } from 'aws-cdk-lib/aws-s3';

export class DataStack extends Stack {
	public readonly spacesTable: ITable;
	public readonly deploymentBucket: IBucket;
	public readonly photosBucket: IBucket;

	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		const suffix = getSuffixFromStack(this);

		// Deploy UI stack
		// this.deploymentBucket = new Bucket(this, 'SpaceFinderFrontend', {
		// 	bucketName: `space-finder-frontend-${suffix}`,
		// 	publicReadAccess: true,
		// 	websiteIndexDocument: 'index.html',
		// });

		// Deploy photosBucket
		this.photosBucket = new Bucket(this, 'SpaceFinderPhotos', {
			bucketName: `space-finder-photos-${suffix}`,
			cors: [
				{
					allowedMethods: [HttpMethods.HEAD, HttpMethods.GET, HttpMethods.PUT],
					allowedOrigins: ['*'],
					allowedHeaders: ['*'],
				},
			],
			// accessControl: BucketAccessControl.PUBLIC_READ // Currently not working
			blockPublicAccess: {
				blockPublicAcls: false,
				blockPublicPolicy: false,
				ignorePublicAcls: false,
				restrictPublicBuckets: false,
			},
		});

		new CfnOutput(this, 'SpaceFinderPhotosBucketName', {
			value: this.photosBucket.bucketName,
		});

		this.spacesTable = new Table(this, 'SpacesTable', {
			partitionKey: {
				name: 'id',
				type: AttributeType.STRING,
			},
			tableName: `SpaceTable-${suffix}`,
		});
	}
}
