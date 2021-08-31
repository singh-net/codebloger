using System.Threading.Tasks;
using API.Interfaces;
using AutoMapper;

namespace API.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UnitOfWork(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;

        }
        public IUserRepository UserRepository => new UserRepository(_context, _mapper);
        public IBlogRepository BlogRepository => new BlogRepository(_context, _mapper);
        public IArticleLikeRepository ArticleLikeRepository => new ArticleLikeRepository(_context);

        public IFollowRepository FollowRepository => new FollowRepository(_context, _mapper);

        public ICommentRepository CommentRepository => new CommentRepository(_context, _mapper);


        public async Task<bool> Complete()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public bool HasChanges()
        {
            return _context.ChangeTracker.HasChanges();
        }
    }
}