using System.Threading.Tasks;
using API.Entities;
using API.Dtos;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ArticleLikeController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ArticleLikeController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpPost("{articleId}")]
        public async Task<ActionResult> AddArticleLike(int articleId)
        {
            var userId = User.GetUserId();
            var likedArticle = await _unitOfWork.BlogRepository.GetArticleByIdAsync(articleId);
            var likeUser = await _unitOfWork.UserRepository.GetUserByIdAsync(userId);

            if (likedArticle == null) return NotFound(articleId.ToString() + " Article not found");

            if (likedArticle.AppUserId == userId) return BadRequest("You cannot like your own article");

            var articleLike = await _unitOfWork.ArticleLikeRepository.GetArticleLike(userId, articleId);

            if (articleLike != null)
            {
                likeUser.LikedArticles.Remove(articleLike);
                if (await _unitOfWork.Complete())    
                return Ok(new {message = "Disliked"});
            }

            articleLike = new ArticleLike
            {
                AppUserId = userId,
                ArticleId = likedArticle.Id
            };

            likeUser.LikedArticles.Add(articleLike);
            if (await _unitOfWork.Complete()) return Ok(new {message = "Liked"});
            return BadRequest("Failed to like article");

        }
    }
}