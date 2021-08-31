using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;

namespace API.Data
{
    public class ArticleLikeRepository : IArticleLikeRepository
    {
        private readonly DataContext _context;
        public ArticleLikeRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<ArticleLike> GetArticleLike(int userId, int articleId)
        {
           return await _context.ArticleLikes.FindAsync(userId, articleId);
        }

        public Task<AppUser> GetUserArticleLikes(int userId)
        {
            throw new System.NotImplementedException();
        }
    }
}