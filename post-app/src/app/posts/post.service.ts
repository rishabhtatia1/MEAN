import { Post } from "./post.model";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: "root" })

export class PostsService {
  posts: Post[] = []
  private postUpdated = new Subject<{posts:Post[], pageCount: number}>();

  constructor(private http: HttpClient, private router: Router) { };
  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(map((postData) => {
        return {posts: postData.posts.map((post: any) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        }),
         maxPosts: postData.maxPosts}
      }))
      .subscribe(data => {
        this.posts = data.posts;
        this.postUpdated.next({posts: [...this.posts], pageCount: data.maxPosts});
      });
  }
  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }
  addPost(title: string, content: string, image: File) {
    // const post: Post = { id: null, title: title, content: content };
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });

  }
  getPost(id: string) {
    return this.http.get<{_id:string,
       title:string,
       content:string,
        imagePath: string}>('http://localhost:3000/api/posts/' + id);
  }

  updatePost(id: string, title: string, content: string, image: string | File) {
let postData : Post | FormData;
if (typeof(image) === 'object') {
  postData = new FormData();
  postData.append("id", id);
  postData.append("title", title);
  postData.append("content", content);
  postData.append("image", image, title);
} else {
  postData = {
     id: id,
     title: title,
     content: content,
      imagePath: image
     };
}
    this.http.put<{ message: string , imagePath:string}>('http://localhost:3000/api/posts/' + id,postData)
    .subscribe((response) => {
      this.router.navigate(["/"]);
    })
}

  deletePost(postId: string) {
    return this.http.delete<{ message: string }>('http://localhost:3000/api/posts/' + postId);
  }
}
