using System.Threading.Tasks;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FollowController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        public FollowController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }


        [HttpPost("{username}")]
        public async Task<ActionResult> AddFollow(string username)
        {
            var sourceUserId = User.GetUserId();
            var followedUser = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            var sourceUser = await _unitOfWork.FollowRepository.GetUserWithFollows(sourceUserId);

            if (followedUser == null) return NotFound();

            if (sourceUser.UserName == username) return BadRequest("You cannot follow yourself");

            var userFollow = await _unitOfWork.FollowRepository.GetUserFollow(sourceUserId, followedUser.Id);

            if (userFollow != null)
            {

                sourceUser.FollowedUsers.Remove(userFollow);
                if (await _unitOfWork.Complete()) return Ok(new {message = "unfollowed"});
                //return BadRequest("You already follow this user");
            }

            userFollow = new UserFollow
            {
                SourceUserId = sourceUserId,
                FollowedUserId = followedUser.Id
            };

            sourceUser.FollowedUsers.Add(userFollow);

            if (await _unitOfWork.Complete()) return Ok(new {message = "followed"});

            return BadRequest("Failed to follow user");

        }

        [HttpGet]
        public async Task<ActionResult> GetUserFollows(string username)
        {
            var sourceUserId = User.GetUserId();
            var users = await _unitOfWork.FollowRepository.GetUserWithFollows(sourceUserId);
            return Ok(users);
        }

        [HttpGet("followers")]
        public async Task<ActionResult> GetUserFollowers(string username)
        {
            var userId = User.GetUserId();
            var users = await _unitOfWork.FollowRepository.GetUserFollowersAsync(userId);
            return Ok(users);
        }

        [HttpGet("followings")]
        public async Task<ActionResult> GetUserFollowings(string username)
        {
            var userId = User.GetUserId();
            var users = await _unitOfWork.FollowRepository.GetUserFollowingsAsync(userId);
            return Ok(users);
        }

        [HttpGet("is-following/{username}")]
        public async Task<ActionResult> isFollowing(string username)
        {
            if (username != null)
            {
                var sourceUserId = User.GetUserId();

                var followedUser = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
                var sourceUser = await _unitOfWork.FollowRepository.GetUserWithFollows(sourceUserId);

                if (followedUser == sourceUser) return Ok();

                if (followedUser == null) return NotFound();

                if (sourceUser.UserName == username) return BadRequest("You cannot follow yourself");

                var userFollow = await _unitOfWork.FollowRepository.GetUserFollow(sourceUserId, followedUser.Id);

                if (userFollow != null) return Ok(true);
                return Ok(false);
            }
            return Ok();

        }

    }
}