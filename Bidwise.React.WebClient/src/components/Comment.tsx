import { CommentDto } from "@/hooks/queries/usePaginatedComments";
import {
  Stack,
  HStack,
  Avatar,
  Text,
  Button,
  Textarea,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { memo, useEffect, useState } from "react";
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteComment } from "@/hooks/mutations/useDeleteComment";
import { useUpdateComment } from "@/hooks/mutations/useUpdateComment";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { pickAvatarColorPalette } from "@/utils/pickAvatarColorPalette";

export const Comment = memo(({ comment }: { comment: CommentDto }) => {
  const { userId } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [commentValue, setCommentValue] = useState(comment.commentText);

  const updateMutation = useUpdateComment(comment.itemId);
  const deleteMutation = useDeleteComment(comment.itemId);

  const navigate = useNavigate();

  const handleUpdate = () => {
    if (!commentValue.trim()) return;

    updateMutation
      .mutateAsync({
        id: comment.id,
        commentText: commentValue,
      })
      .then(() => {
        setUpdateDialogOpen(false);
      });
  };

  const handleDelete = () => {
    deleteMutation
      .mutateAsync({
        id: comment.id,
      })
      .then(() => {
        setDeleteDialogOpen(false);
      });
  };

  useEffect(() => {
    setCommentValue(comment.commentText);
  }, [updateDialogOpen]);

  return (
    <HStack gap="4">
      <Avatar.Root colorPalette={pickAvatarColorPalette(comment.userName)}>
        <Avatar.Fallback name={comment.userName} />
      </Avatar.Root>
      <Stack gap="0">
        <HStack>
          <Text fontWeight="medium">
            <Link
              to={`/users/${comment.userId}/listings?UserName=${comment.userName}`}
            >
              {comment.userName}
            </Link>
          </Text>
          <Text color="fg.subtle" textStyle="xs">
            {comment.createdAt !== comment.updatedAt && "edited"}{" "}
            {dayjs(
              comment.createdAt !== comment.updatedAt
                ? comment.updatedAt
                : comment.createdAt
            ).fromNow()}
          </Text>
          {userId === comment.userId && (
            <HStack gap={0}>
              <DialogRoot
                lazyMount
                open={updateDialogOpen}
                onOpenChange={(e) => setUpdateDialogOpen(e.open)}
              >
                <DialogTrigger asChild>
                  <Button variant="plain" size="sm" p={0}>
                    <MdEdit />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Comment</DialogTitle>
                  </DialogHeader>
                  <DialogBody pb="8">
                    <Textarea
                      autoresize
                      value={commentValue}
                      onChange={(e) => setCommentValue(e.target.value)}
                    />
                  </DialogBody>
                  <DialogFooter>
                    <DialogActionTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogActionTrigger>
                    <Button
                      colorPalette="teal"
                      onClick={handleUpdate}
                      loading={updateMutation.isLoading}
                    >
                      Edit
                    </Button>
                  </DialogFooter>
                  <DialogCloseTrigger />
                </DialogContent>
              </DialogRoot>
              <DialogRoot
                role="alertdialog"
                lazyMount
                open={deleteDialogOpen}
                onOpenChange={(e) => setDeleteDialogOpen(e.open)}
              >
                <DialogTrigger asChild>
                  <Button variant="plain" size="sm" colorPalette="red" p={0}>
                    <MdOutlineDelete />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                  </DialogHeader>
                  <DialogBody>
                    <p>
                      This action cannot be undone. This will permanently delete
                      your comment.
                    </p>
                  </DialogBody>
                  <DialogFooter>
                    <DialogActionTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogActionTrigger>
                    <Button
                      colorPalette="red"
                      onClick={handleDelete}
                      loading={deleteMutation.isLoading}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                  <DialogCloseTrigger />
                </DialogContent>
              </DialogRoot>
            </HStack>
          )}
        </HStack>
        <Text color="fg.muted" textStyle="sm">
          {comment.commentText}
        </Text>
      </Stack>
    </HStack>
  );
});

export const CommentLoading = () => {
  return (
    <HStack gap="5">
      <SkeletonCircle size="12" />
      <Stack flex="1">
        <Skeleton height="5" width="30%" />
        <Skeleton height="7" />
      </Stack>
    </HStack>
  );
};
