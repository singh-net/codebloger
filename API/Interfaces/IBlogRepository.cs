using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IBlogRepository
    {
        void Update(Article article);
        void Delete(Article article);
        void InsertArticle(Article article);
        Task<List<ArticleToReturnDto>> GetArticlesAsync();
        Task<PagedList<ArticleToReturnDto>> GetArticlesPagedListAsync(UserParams userParams);
        Task<PagedList<ArticleToReturnDto>> GetPublishedArticlestAsync(UserParams userParams);
        Task<List<ArticleForListsDto>> GetTopFeaturedArticlesAsync();
        Task<List<ArticleForListsDto>> GetTop10ArticlesByUserAsync(string username);
        Task<ArticleToReturnDto> GetArticleByIdAsync(int id);
        Task<ArticleToReturnDto> GetArticleBySlugAsync(string slug);
        Task<List<ArticleToReturnDto>> GetArticlesByCategoryAsync(int id);
        Task<List<ArticleToReturnDto>> GetArticlesByCategoryNameAsync(string name);
        Task<List<CategoryDto>> GetCategoriesAsync();
        Task<List<CategoryDto>> GetTopCategoriesAsync();
        Task<CategoryDto> GetCategoryByIdAsync(int id);
        Task<Category> GetCategoryFullByIdAsync(int id);
        Task<Category> GetCategoryByNameAsync(string name);
        void DeleteCategory(Category category);
        void InsertCategory(Category category);
        Task<Article> GetFullArticleAsync(int id); //maybe not needed

        Task ViewCounterPlus(string slug);



    }
}