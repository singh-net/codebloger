using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Slugify;

namespace API.Data
{
    public class BlogRepository : IBlogRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public BlogRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<ArticleToReturnDto> GetArticleByIdAsync(int id)
        {
            var article = await _context.Articles
                            .Include(u => u.AppUser)
                            .Include(c => c.Comments)
                            .Include(c => c.ArticleCategories)
                            .ThenInclude(c => c.Category)
                            .FirstOrDefaultAsync(a => a.Id == id);
            return _mapper.Map<Article, ArticleToReturnDto>(article);
        }

        public async Task<ArticleToReturnDto> GetArticleBySlugAsync(string slug)
        {

            //await ViewCounterPlus(slug);
            var article = await _context.Articles
                                    .Include(u => u.AppUser).ThenInclude(p => p.UserPhotos)
                                    .Include(c => c.Comments).ThenInclude(u => u.AppUser).ThenInclude(p => p.UserPhotos)
                                    .Include(a => a.LikedArticles)
                                    .Include(c => c.ArticleCategories)
                                    .ThenInclude(c => c.Category)
                                    .FirstOrDefaultAsync(a => a.Slug == slug);
            return _mapper.Map<Article, ArticleToReturnDto>(article);
        }

        public async Task<List<ArticleToReturnDto>> GetArticlesAsync()
        {
            var articles = await _context.Articles.Include(u => u.AppUser).Include(c => c.ArticleCategories).ThenInclude(c => c.Category).ToListAsync();
            return _mapper.Map<List<Article>, List<ArticleToReturnDto>>(articles);
        }

        public async Task<List<ArticleToReturnDto>> GetArticlesByCategoryAsync(int id)
        {

            var articles = await _context.Articles
                                .Where(a => a.ArticleCategories
                                .Any(c => c.CategoryId == id))
                                .Include(u => u.AppUser)
                                .Include(c => c.ArticleCategories)
                                .ThenInclude(c => c.Category)
                                .ToListAsync();
            return _mapper.Map<List<Article>, List<ArticleToReturnDto>>(articles);
        }

        public async Task<List<ArticleToReturnDto>> GetArticlesByCategoryNameAsync(string name)
        {
            var articles = await _context.Articles
                               .Where(a => a.ArticleCategories
                               .Any(c => c.Category.Name == name))
                               .Include(u => u.AppUser)
                               .Include(c => c.ArticleCategories)
                               .ThenInclude(c => c.Category)
                               .ToListAsync();
            return _mapper.Map<List<Article>, List<ArticleToReturnDto>>(articles);
        }

        public async Task<PagedList<ArticleToReturnDto>> GetArticlesPagedListAsync(UserParams userParams)
        {
            var query = _context.Articles.AsQueryable();

            if (userParams.Filter != null && userParams.Filter != "")
            {

                if (userParams.Filter == "admin")
                {
                    query = _context.Articles.AsQueryable();
                }

                if (userParams.Filter == "self")
                {
                    query = query.Where(x => x.AppUser.UserName == userParams.Username);
                }

                if (userParams.Filter == "profile")
                {
                    query = query.Where(x => x.AppUser.UserName == userParams.Username);
                    query = query.Where(x => x.IsPublished == true);
                }

                if (userParams.Filter == "all")
                {
                    query = query.Where(x => x.IsPublished == true);
                }

            }

            // if (userParams.isAdmin == true)
            // {
            //     query = _context.Articles.AsQueryable();
            // }
            // else if (userParams.isSelf)
            // {
            //     query = query.Where(x => x.AppUser.UserName == userParams.Username);
            // }



            query = query.Include(u => u.AppUser).Include(c => c.ArticleCategories).ThenInclude(c => c.Category);

            if (userParams.Filter == "tag")
            {
                //query = query.Include(c => c.ArticleCategories.Where(x => x.Category.Name == "Math"));
                //query = query.Where(x => x.ArticleCategories);

            }


            query = userParams.OrderBy switch
            {
                "dateCreated" => query.OrderByDescending(u => u.DateCreated),
                "viewCount" => query.OrderByDescending(u => u.ViewCount),
                "likeCount" => query.OrderByDescending(u => u.LikedArticles.Count()),
                _ => query.OrderByDescending(x => x.ViewCount)

            };

            var result = await PagedList<ArticleToReturnDto>.CreateAsync(query.ProjectTo<ArticleToReturnDto>(_mapper.ConfigurationProvider).AsNoTracking(),
                        userParams.PageNumber, userParams.PageSize);
            return result;
        }

        public async Task<List<CategoryDto>> GetCategoriesAsync()
        {
            var categories = await _context.Categories.Include(x => x.ArticleCategories).ToListAsync();
            return _mapper.Map<List<Category>, List<CategoryDto>>(categories);
        }

        public async Task<CategoryDto> GetCategoryByIdAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            return _mapper.Map<Category, CategoryDto>(category);
        }

        public void InsertArticle(Article article)
        {
            SlugHelper sh = new SlugHelper();
            var generator = new Random();
            var num = generator.Next(10000, 99999);
            article.Slug = sh.GenerateSlug(article.Title) + "-" + num.ToString();
            _context.Articles.Add(article);
        }

        public void Update(Article article)
        {
            _context.Entry(article).State = EntityState.Modified;
        }

        public async Task ViewCounterPlus(string slug)
        {
            var article = await _context.Articles.FirstOrDefaultAsync(s => s.Slug == slug);
            if (article != null)
            {
                article.ViewCount++;
                await _context.SaveChangesAsync();
            }

        }
        //TEMP
        public async Task<Article> GetFullArticleAsync(int id)
        {
            return await _context.Articles.Include(l => l.LikedArticles).FirstOrDefaultAsync(x => x.Id == id);

        }

        public void Delete(Article article)
        {

            //_context.Entry(article.LikedArticles).State = EntityState.Deleted;
            // _context.Entry(article.Comments).State = EntityState.Deleted;
            // _context.Entry(article.LikedArticles).State = EntityState.Deleted;

            //var likes =  _context.ArticleLikes.Where(x => x.AppUserId == article.Id);
            //_context.Entry(article.LikedArticles).State = EntityState.Deleted;

            //var comments = _context.Comments.Where(x => x.Id == article.Id);
            //_context.Entry(article.Comments).State = EntityState.Deleted;


            _context.Entry(article).State = EntityState.Deleted;
        }

        public void InsertCategory(Category category)
        {
            _context.Categories.Add(category);
        }

        public async Task<Category> GetCategoryByNameAsync(string name)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(n => n.Name.ToLower() == name.ToLower());
            return category;
        }

        public void DeleteCategory(Category category)
        {
            _context.Entry(category).State = EntityState.Deleted;
        }

        public async Task<Category> GetCategoryFullByIdAsync(int id)
        {
            return await _context.Categories.FindAsync(id);
        }

        public async Task<List<ArticleForListsDto>> GetTopFeaturedArticlesAsync()
        {
            var articles = await _context.Articles.Where(x => x.IsFeatured == true).Include(u => u.AppUser).Take(10).OrderByDescending(x => x.LikedArticles.Count()).ToListAsync();
            return _mapper.Map<List<Article>, List<ArticleForListsDto>>(articles);

        }

        public async Task<List<CategoryDto>> GetTopCategoriesAsync()
        {
            var categories = await _context.Categories.Include(x => x.ArticleCategories).OrderByDescending(c => c.ArticleCategories.Count()).Take(30).ToListAsync();
            return _mapper.Map<List<Category>, List<CategoryDto>>(categories);
        }

        public async Task<PagedList<ArticleToReturnDto>> GetPublishedArticlestAsync(UserParams userParams)
        {
            var query = _context.Articles.AsQueryable();

            query = query.Where(x => x.IsPublished == true);

            query = query.Include(u => u.AppUser).Include(c => c.ArticleCategories).ThenInclude(c => c.Category);
            query = userParams.OrderBy switch
            {
                "dateCreated" => query.OrderByDescending(u => u.DateCreated),
                "viewCount" => query.OrderByDescending(u => u.ViewCount),
                "likeCount" => query.OrderByDescending(u => u.LikedArticles.Count()),
                _ => query.OrderByDescending(x => x.ViewCount)

            };

            var result = await PagedList<ArticleToReturnDto>.CreateAsync(query.ProjectTo<ArticleToReturnDto>(_mapper.ConfigurationProvider).AsNoTracking(),
                        userParams.PageNumber, userParams.PageSize);
            return result;
        }

        public async Task<List<ArticleForListsDto>> GetTop10ArticlesByUserAsync(string username)
        {
            var articles = await _context.Articles
                                .Where(x => x.AppUser.UserName == username)
                                .Include(u => u.AppUser).Take(10)
                                .OrderByDescending(x => x.LikedArticles.Count()).ToListAsync();
            return _mapper.Map<List<Article>, List<ArticleForListsDto>>(articles);


        }
    }
}