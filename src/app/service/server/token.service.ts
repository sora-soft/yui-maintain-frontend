import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor() {
    try {
      const parsed = JSON.parse(localStorage.getItem('sora-authorization') || '{}');
      this.token_ = parsed.token;
      this.expireAt_ = parsed.expireAt;
    } catch(err) {}
  }

  setToken(token: string, expireAt: number) {
    this.token_ = token;
    this.expireAt_ = expireAt;
    localStorage.setItem('sora-authorization', JSON.stringify({
      token,
      expireAt,
    }));
  }
  // set token(token: string | null) {
  //   this.token_ = token;
  //   if (token) {
  //     localStorage.setItem('sora-authorization', token);
  //   } else {
  //     localStorage.removeItem('sora-authorization');
  //   }
  // }

  get token(): string | null {
    if (this.expireAt_ && Date.now() / 1000 > this.expireAt_) {
      return null;
    }
    return this.token_;
  }

  private token_: string | null = null;
  private expireAt_: number | null = null;
}
