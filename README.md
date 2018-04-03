# base64-cloudify

This module processes [data URI](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) string and uploads an image to [Google Cloud Storage](https://cloud.google.com/storage/). **Due to limited support** ([test here](https://kangax.github.io/jstests/toDataUrl_mime_type_test/)), for now, **only .jpeg | .png extensions are supported by this module**.

### Prerequisites
NodeJS and npm are required.

### Installation
To install please run
`npm install --save base64-cloudify`

### Description
This module exposes a function `cloudify` which is a promisified and callback-compatible NodeJS function that accepts the following parameters:
* *error* - an Error instance;
* *options* - an object with the following properties:
  * *key* - service account [key](#key);
  * *projectId* - [project id](#projectid);
  * *bucketName* - name of the existing [bucket](https://cloud.google.com/storage/docs/creating-buckets);
  * *filenamePrefix* - if omitted, defaults to `'img'`;
  * *img* - [data URI](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) string;
* *callback* - optional; typical NodeJS function to be called with error and data arguments when upload completed.

After being invoken with proper arguments, the function saves an image to Google Cloud Storage under the name that consists of `filenamePrefix-timestamp.extension`and immediately makes it public.
**Make sure the storage is [configured properly](#configure)**

### Return Value
returns a Promise that resolves to a string - *url* to access the uploaded image.

### Example
```javascript
const options = {
    key: require('../config/storage-service-account-sample.json'),
    projectId: 'sample-project',
    bucketName: 'sample_bucket',
    filenamePrefix: 'sampleImg',
    img: req.body.img
  };

cloudify(null, options)
   .then( url => res.status(200).send(url))
```

## How to
#### Key
To get a key, please visit [Google API Console](https://console.developers.google.com/projectselector/apis/library?supportedpurview=project), [create a Project](https://developers.google.com/google-apps/activity/v1/guides/project).  Then on your project Dashboard click Enable APIS and Services button at the top-left part of your screen to enable Cloud Storage. Then through Credentials link (left side menu) create credentials => service account key and download it in JSON.
#### ProjectId
May be found on [Google API Console](https://console.developers.google.com/projectselector/apis/library?supportedpurview=project) in select-a-project menu.
#### Configure
Go to [Google Cloud Platform](https://console.cloud.google.com) dashboard => storage => buckets => name find menu editBucketPermissions - add members => storageObjectCreator and fill in the email of your service account from the [key](#key).