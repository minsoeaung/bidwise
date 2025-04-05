namespace Bidwise.Common.Models.Spring;

public class CommentModel
{
    public int Id { get; set; }
    public int ItemId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; }
    public string CommentText { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}
