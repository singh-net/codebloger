using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;

namespace API.Interfaces
{
    public interface ICommentRepository
    {
        Task<List<Comment>> GetCommentsForArticleAsync(int id);
        void InsertComment(Comment comment);
    }
}