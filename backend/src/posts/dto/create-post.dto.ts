export class CreatePostDto {
  content: string;
  address: string;
  lat?: number;
  lng?: number;
  type?: string;
  sphere?: string;
}
