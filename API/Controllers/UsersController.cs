using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class UsersController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPhotoService _photoService;
        public UsersController(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService)
        {
            _photoService = photoService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<MemberDto>>> GetUsers()
        {
            //var users = await _unitOfWork.UserRepository.GetMembersAsync();
            var users = await _unitOfWork.UserRepository.GetUserByIdAsync(3);
            // return Ok(users);
            return NotFound();
        }

        // [HttpGet("{username}")]
        // public async Task<ActionResult<UserToReturnDto>> GetUser(string username)
        // {
        //     return await _unitOfWork.UserRepository.GetMemberAsync(username);

        // }

        [Authorize]
        [HttpPost("add-photo")]
        public async Task<ActionResult<UserPhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            // var result = await _photoService.AddPhotoAsync(file);

            // if (result.Error != null) return BadRequest(result.Error.Message);

            // var photo = new UserPhoto
            // {
            //     Url = result.SecureUrl.AbsoluteUri,
            //     PublicId = result.PublicId
            // };

            // if (user.UserPhotos.Count == 0)
            // {
            //     photo.IsMain = true;
            // }

            // user.UserPhotos.Add(photo);

            // if (await _unitOfWork.Complete())

            //     return CreatedAtRoute("GetUser", new { Username = user.UserName }, _mapper.Map<UserPhotoDto>(photo));

            // return BadRequest("Problem uploading photo");

            var result = _photoService.AddUserPhotoAsync(file);

            var photo = new UserPhoto
            {
                Url = "images/" + result.Result,
                PublicId = ""
            };

            user.UserPhotos.Add(photo);

            if (await _unitOfWork.Complete())

                return CreatedAtRoute("GetUser", new { Username = user.UserName }, _mapper.Map<UserPhotoDto>(photo));

            return BadRequest("Problem uploading photo");

        }


        [Authorize]
        [HttpGet("users")]
        public async Task<ActionResult<List<MemberForListDto>>> GetUsersAsync()
        {
            var users = await _unitOfWork.UserRepository.GetMembersAsync();
            return Ok(users);
        }

        [Authorize]
        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            var photo = user.UserPhotos.FirstOrDefault(x => x.Id == photoId);

            if (photo.IsMain) return BadRequest("This is already your main photo");

            var currentMain = user.UserPhotos.FirstOrDefault(x => x.IsMain);

            if (currentMain != null) currentMain.IsMain = false;
            photo.IsMain = true;

            if (await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to set main photo");
        }

        [Authorize]
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());
            var photo = user.UserPhotos.FirstOrDefault(x => x.Id == photoId);
            if (photo == null) return NotFound();
            if (photo.IsMain) return BadRequest("You cannot delete your main photo");

            // if (photo.PublicId != null)
            // {
            //     var result = await _photoService.DeletePhotoAsync(photo.PublicId);

            //     if (result.Error != null) return BadRequest(result.Error.Message);

            // }

            //ALSO REMOVE PHOTO FROM DISK LATER

            user.UserPhotos.Remove(photo);

            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("Failed to delete the photo");
        }

        [HttpGet("{username}", Name = "GetUser")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            var member = await _unitOfWork.UserRepository.GetMemberAsync(username);
            if (member != null) return Ok(member);
            return NotFound();
        }

        [HttpGet("top-bloggers")]
        public async Task<ActionResult<List<MemberForListDto>>> GetTopBloggers()
        {
            return await _unitOfWork.UserRepository.GetTopBloggersAsync();
        }

        [Authorize]
        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberDto userUpdateDto)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            _mapper.Map(userUpdateDto, user);

            //user =_mapper.Map<MemberDto, AppUser>(userUpdateDto);

            _unitOfWork.UserRepository.Update(user);
            if (await _unitOfWork.Complete())
                return NoContent();
            return BadRequest("Failed to update");
        }

    }
}