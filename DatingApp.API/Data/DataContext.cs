using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DataContext:DbContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Like>().HasKey(m => new { m.LikeeId, m.LikerId });

            modelBuilder.Entity<Like>()
                .HasOne(m => m.Likee)
                .WithMany(m => m.Likers)
                .HasForeignKey(m => m.LikeeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Like>()
                .HasOne(m => m.Liker)
                .WithMany(m => m.Likees)
                .HasForeignKey(m => m.LikerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
        public DataContext(DbContextOptions<DataContext> options):base(options){ }

        public DbSet<Value> Values { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Like> Likes { get; set; }
    }
}