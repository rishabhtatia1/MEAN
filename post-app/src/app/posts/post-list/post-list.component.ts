
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  private subscription: Subscription;
  constructor(public postService: PostsService) { }
  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postPerPage, this.currentPage);
    this.subscription = this.postService.getPostUpdateListener()
      .subscribe((postData: {posts:Post[], pageCount: number}) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.pageCount;
      })
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onChangedPage(pageData : PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postService.getPosts(this.postPerPage, this.currentPage);

  }

  onDelete(postId: string) {
this.postService.deletePost(postId).subscribe(() => {
  this.postService.getPosts(this.postPerPage, this.currentPage);
});
  }
}
