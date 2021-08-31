using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using API.Helpers;
using API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace API.Services
{
    public class PhotoService : IPhotoService
    {
        private readonly Cloudinary _cloudinary;
        public PhotoService(IOptions<CloudinarySettings> config)
        {
            var acc = new Account
            (
            // config.Value.CloudName,
            // config.Value.ApiKey,
            // config.Value.ApiSecret
            "dk5tdzjvl",
            "853814815372814",
            "otFiGWAYPnzCJp7lBIyzw74rTZI"

            );

            _cloudinary = new Cloudinary(acc);

        }

        public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)
        {
            var uploadResults = new ImageUploadResult();
            if (file.Length > 0)
            {
                using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation().Height(300).Width(800).Crop("fill").Gravity("face")
                };

                //_cloudinary.Api.Timeout = 6000;
                uploadResults = await _cloudinary.UploadAsync(uploadParams);

            }

            return uploadResults;
        }

        public async Task<DeletionResult> DeletePhotoAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);
            return result;
        }


        public async Task<string> AddUserPhotoAsync(IFormFile file)
        {

            var folderName = Path.Combine("wwwroot", "images");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
            var ext = Path.GetExtension(fileName);
            fileName = System.Guid.NewGuid().ToString() + ext;
            var fullPath = Path.Combine(pathToSave, fileName);
            var dbPath = Path.Combine(folderName, fileName);
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
               await file.CopyToAsync(stream);
            }
            return fileName;

        }
    }
}