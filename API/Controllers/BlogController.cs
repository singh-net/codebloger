using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BlogController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPhotoService _photoService;
        private readonly IMapper _mapper;
        public BlogController(IUnitOfWork unitOfWork, IPhotoService photoService, IMapper mapper)
        {
            _mapper = mapper;
            _photoService = photoService;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IActionResult> GetArticles()
        {
            var articles = await _unitOfWork.BlogRepository.GetArticlesAsync();
            return Ok(articles);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetArticleById(int id)
        {
            var article = await _unitOfWork.BlogRepository.GetArticleByIdAsync(id);
            return Ok(article);
        }

        [HttpGet("a/{slug}")]
        public async Task<IActionResult> GetArticleBySlug(string slug)
        {
            var article = await _unitOfWork.BlogRepository.GetArticleBySlugAsync(slug);
            if (article != null) return Ok(article);
            return NotFound();
        }

        [HttpGet("viewCountPlus/{slug}")]
        public async Task<IActionResult> ViewCountPlus(string slug)
        {
            //var article = await _unitOfWork.BlogRepository.GetArticleBySlugAsync(slug);
            //return Ok(article);

            await _unitOfWork.BlogRepository.ViewCounterPlus(slug);
            return Ok();

        }

        [HttpGet("c/{id}")]
        public async Task<IActionResult> GetArticlesByCategory(int id)
        {
            var articles = await _unitOfWork.BlogRepository.GetArticlesByCategoryAsync(id);
            if (articles.Count == 0) return NotFound("No articles in this category");
            return Ok(articles);
        }

        [HttpGet("category/{name}")]
        public async Task<IActionResult> GetArticlesByCategoryName(string name)
        {
            var articles = await _unitOfWork.BlogRepository.GetArticlesByCategoryNameAsync(name);
            if (articles.Count == 0) return NotFound("No articles in this category");
            return Ok(articles);
        }

        [HttpPost]
        public async Task<ActionResult> AddArticle(Article article)
        {
            _unitOfWork.BlogRepository.InsertArticle(article);
            if (await _unitOfWork.Complete())
            {
                return Ok(article);
            }

            return BadRequest("Error adding article");
        }


        [HttpGet("categories")]
        public async Task<ActionResult> GetCategories()
        {
            return Ok(await _unitOfWork.BlogRepository.GetCategoriesAsync());
        }

        [HttpGet("top-categories")]
        public async Task<ActionResult> GetTopCategories()
        {
            return Ok(await _unitOfWork.BlogRepository.GetTopCategoriesAsync());
        }

        [HttpGet("categories/{id}")]
        public async Task<ActionResult> GetCategory(int id)
        {
            return Ok(await _unitOfWork.BlogRepository.GetCategoryByIdAsync(id));
        }



        [Authorize]
        [HttpPost("add-category")]
        public async Task<ActionResult> InsertCategory(Category category)
        {

            var cat = await _unitOfWork.BlogRepository.GetCategoryByNameAsync(category.Name);
            if (cat != null)
                return BadRequest("Tag " + category.Name + " already exists");

            _unitOfWork.BlogRepository.InsertCategory(category);

            if (await _unitOfWork.Complete())
            {
                return Ok(category);
            }
            return BadRequest("Error adding Category");
        }

        [Authorize]
        [HttpDelete("delete-category/{id}")]
        public async Task<ActionResult> RemoveCategory(int id)
        {
            var category = await _unitOfWork.BlogRepository.GetCategoryFullByIdAsync(id);
            _unitOfWork.BlogRepository.DeleteCategory(category);

            if (await _unitOfWork.Complete())
                return NoContent();
            return BadRequest("Failed to Delete");
        }

        [HttpGet("paged")]
        public async Task<ActionResult<IEnumerable<ArticleToReturnDto>>> GetArticlesParams([FromQuery] UserParams userParams)
        {
            if (userParams.Username != null && userParams.Username != "" && userParams.Filter == "admin-manage")
            {
                //var puser = _unitOfWork.UserRepository.GetUserByUsernameAsync(userParams.Username);
                var sourceUserId = User.GetUserId();
                if (User.IsInRole("Admin"))
                {
                    userParams.Filter = "admin";
                }

                //if (sourceUserId != 0)
                //{
                //    var user = await _unitOfWork.UserRepository.GetUserByIdAsync(sourceUserId);
                //    if (user.UserName == userParams.Username)
                //    {
                //        userParams.isSelf = true;
                //    }
                //}
            }
            var articles = await _unitOfWork.BlogRepository.GetArticlesPagedListAsync(userParams);
            Response.AddPaginationHeader(articles.CurrentPage, articles.PageSize, articles.TotalCount, articles.TotalPages);
            return Ok(articles);
        }


        [HttpGet("published")]
        public async Task<ActionResult<IEnumerable<ArticleToReturnDto>>> GetPublishedArticlesParams([FromQuery] UserParams userParams)
        {

            var articles = await _unitOfWork.BlogRepository.GetPublishedArticlestAsync(userParams);
            Response.AddPaginationHeader(articles.CurrentPage, articles.PageSize, articles.TotalCount, articles.TotalPages);
            return Ok(articles);
        }

        [HttpGet("featured10")]
        public async Task<ActionResult<ArticleForListsDto>> GetFeaturedArticles()
        {
            var articles = await _unitOfWork.BlogRepository.GetTopFeaturedArticlesAsync();
            return Ok(articles);
        }

        [HttpGet("more-by-user/{username}")]
        public async Task<ActionResult<ArticleForListsDto>> GetTop10ArticlesByUserAsync(string username)
        {
            var articles = await _unitOfWork.BlogRepository.GetTop10ArticlesByUserAsync(username);
            return Ok(articles);
        }


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
                PublicId = "",
                isProfileImage = false,
                AppUserId = user.Id,
                IsMain = false

            };

            user.UserPhotos.Add(photo);

            if (await _unitOfWork.Complete())

                return CreatedAtRoute("GetUser", new { Username = user.UserName }, _mapper.Map<UserPhotoDto>(photo));

            return BadRequest("Problem uploading photo");


        }
        [Authorize]
        [HttpPut("approve/{id}")]
        public async Task<ActionResult> ApproveArticle(int id)
        {
            var article = await _unitOfWork.BlogRepository.GetFullArticleAsync(id);
            article.IsPublished = true;
            _unitOfWork.BlogRepository.Update(article);
            if (await _unitOfWork.Complete())
                return NoContent();
            return BadRequest("Failed to update");

        }
        [Authorize]
        [HttpPut("not-approve/{id}")]
        public async Task<ActionResult> NotApproveArticle(int id)
        {
            var article = await _unitOfWork.BlogRepository.GetFullArticleAsync(id);
            article.IsPublished = false;
            _unitOfWork.BlogRepository.Update(article);
            if (await _unitOfWork.Complete())
                return NoContent();
            return BadRequest("Failed to update");

        }
        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> RemoveArticle(int id)
        {
            var article = await _unitOfWork.BlogRepository.GetFullArticleAsync(id);
            _unitOfWork.BlogRepository.Delete(article);

            if (await _unitOfWork.Complete())
                return NoContent();
            return BadRequest("Failed to Delete");
        }



    }
}