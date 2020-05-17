using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;
        public DatingRepository(DataContext context)
        {
            _context = context;

        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.Where(m => m.LikerId == userId && m.LikeeId == recipientId).FirstOrDefaultAsync();
        }

        public Task<Photo> GetMainPhotoForUser(int userId)
        {
            return _context.Photos.Where(p => p.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Messages
                            .Include(m => m.Sender).ThenInclude(m => m.Photos)
                            .Include(m => m.Recipient).ThenInclude(m => m.Photos)
                            .AsQueryable();

            switch (messageParams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(m => m.RecipientId == messageParams.UserId && m.RecipientDeleted == false);
                    break;
                case "Outbox":
                    messages = messages.Where(m => m.SenderId == messageParams.UserId && m.SenderDeleted == false);
                    break;
                default:
                    messages = messages.Where(m => m.RecipientId == messageParams.UserId && m.RecipientDeleted == false && m.IsRead == false);
                    break;
            }

            messages = messages.OrderByDescending(m => m.MessageSent);

            return await PagedList<Message>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages
                            .Include(m => m.Sender).ThenInclude(m => m.Photos)
                            .Include(m => m.Recipient).ThenInclude(m => m.Photos)
                            .Where(m => m.RecipientId == userId && m.RecipientDeleted == false 
                                        && m.SenderId == recipientId
                                    || m.SenderId == userId && m.RecipientId == recipientId
                                        && m.SenderDeleted == false)
                            .OrderByDescending(m => m.MessageSent)
                            .ToListAsync();

            return messages;
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);

            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(m => m.Photos).FirstOrDefaultAsync(m => m.Id == id);

            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = _context.Users.Include(m => m.Photos).AsQueryable();

            users = users.Where(m => m.Id != userParams.UserId);

            users = users.Where(m => m.Gender == userParams.Gender);

            if (userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDob = DateTime.Today.AddYears(-userParams.MaxAge);
                var maxDob = DateTime.Today.AddYears(-userParams.MinAge);

                users = users.Where(m => m.DateOfBirth >= minDob && m.DateOfBirth <= maxDob);
            }

            switch (userParams.OrderBy)
            {
                case "created":
                    users = users.OrderByDescending(m => m.Created);
                    break;
                case "age":
                    users = users.OrderByDescending(m => m.DateOfBirth);
                    break;
                default:
                    users = users.OrderByDescending(m => m.LastActive);
                    break;
            }

            if (userParams.Likers)
            {
                var usersLikes = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(m => usersLikes.Contains(m.Id));
            }

            if (userParams.Likees)
            {
                var usersLikes = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(m => usersLikes.Contains(m.Id));
            }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        private async Task<IEnumerable<int>> GetUserLikes(int userId, bool likers)
        {
            var user = await _context.Users
                        .Include(m => m.Likers)
                        .Include(m => m.Likees)
                        .FirstOrDefaultAsync(m => m.Id == userId);

            if (likers)
            {
                return user.Likers.Where(m => m.LikeeId == userId).Select(m => m.LikerId);
            }
            else
            {
                return user.Likees.Where(m => m.LikerId == userId).Select(m => m.LikeeId);
            }
        }
    }
}