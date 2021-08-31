using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class CommentRepository : ICommentRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public CommentRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }



        public async Task<List<Comment>> GetCommentsForArticleAsync(int id)
        {
            var comments = await _context.Comments.Where(a => a.ArticleId == id).Include(u=> u.AppUser).ToListAsync();
            //return _mapper.Map<List<Comment>, List<CommentDto>>(comments);
            return comments;
        }

        public void InsertComment(Comment comment)
        {
            _context.Comments.Add(comment);

        }
    }
}