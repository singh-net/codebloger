using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IUnitOfWork
    {

        IUserRepository UserRepository { get; }
        IBlogRepository BlogRepository { get; }
        IArticleLikeRepository ArticleLikeRepository { get; }
        IFollowRepository FollowRepository { get; }
        ICommentRepository CommentRepository { get; }
        Task<bool> Complete();
        bool HasChanges();

    }
}