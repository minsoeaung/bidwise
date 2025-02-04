using Amazon.S3;
using Amazon.S3.Model;
using Bidwise.Catalog.Services.Interfaces;

namespace Bidwise.Catalog.Services;

public class FileService : IFileService
{
    private const string BucketName = "bidwisebucket";
    private readonly IAmazonS3 _s3Client;

    public FileService(IAmazonS3 amazonS3)
    {
        _s3Client = amazonS3;
    }

    public async Task<DeleteObjectResponse> DeleteFileAsync(string name)
    {
        var deleteObjectRequest = new DeleteObjectRequest
        {
            BucketName = BucketName,
            Key = $"{BucketName}/{name}"
        };

        //await InvalidateCloudFrontCache($"/${path}");

        return await _s3Client.DeleteObjectAsync(deleteObjectRequest);
    }

    public async Task<PutObjectResponse> UploadFileAsync(IFormFile file, string name)
    {
        var pubObjectRequest = new PutObjectRequest()
        {
            BucketName = BucketName,
            Key = $"{BucketName}/{name}",
            ContentType = file.ContentType,
            InputStream = file.OpenReadStream(), // Better than ContentBody
            Metadata =
            {
                ["x-amz-meta-originalname"] = file.FileName,
                ["x-amz-meta-extension"] = Path.GetExtension(file.FileName)
            }
        };

        // await InvalidateCloudFrontCache($"/{path}");

        return await _s3Client.PutObjectAsync(pubObjectRequest);
    }
}
