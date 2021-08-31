using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CommentController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        public CommentController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpPost("insert")]
        public async Task<ActionResult> InsertComment(Comment comment)
        {
            _unitOfWork.CommentRepository.InsertComment(comment);

            if (await _unitOfWork.Complete())
            {
                return Ok(comment);
            }

            return BadRequest("Error adding comment");
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCommentsForArticle(int id)
        {
            var comments = await _unitOfWork.CommentRepository.GetCommentsForArticleAsync(id);

            return Ok(comments);



        }
    }
}