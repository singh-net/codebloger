using System;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Slugify;

namespace API.Controllers
{
    public class PhotoController : BaseApiController
    {
        private readonly IPhotoService _photoService;
        public PhotoController(IPhotoService photoService)
        {
            _photoService = photoService;
        }

        [HttpPost("add-article-photo"), DisableRequestSizeLimit]
        public async Task<IActionResult> Upload()
        {
            try
            {
                var formCollection = await Request.ReadFormAsync();
                var file = formCollection.Files.First();
                var fname = _photoService.AddUserPhotoAsync(file);
                return Ok(fname.Result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }

        }
    }
}