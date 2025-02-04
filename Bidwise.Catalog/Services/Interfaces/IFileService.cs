using Amazon.S3.Model;

namespace Bidwise.Catalog.Services.Interfaces;

public interface IFileService
{
    public Task<PutObjectResponse> UploadFileAsync(IFormFile file, string name);

    public Task<DeleteObjectResponse> DeleteFileAsync(string name);
}
