import { forwardRef, type ImgHTMLAttributes } from 'react';
import imageMetadata from '../../data/imageMetadata.json';
import { useOptionalContentSlice } from '../../context/contentSubscriptions';

export const ResponsiveImage = forwardRef<HTMLImageElement, ImgHTMLAttributes<HTMLImageElement>>(function ResponsiveImage({ alt = '', src, srcSet, sizes, width, height, decoding = 'async', ...props }, ref) {
  const siteSettings = useOptionalContentSlice('siteSettings');
  const replacement = src ? siteSettings?.website?.images[src] : undefined;
  if (replacement) { src = replacement; srcSet = undefined; }
  const info = (src ? siteSettings?.website?.media?.[src] : undefined) ?? imageMetadata[src as keyof typeof imageMetadata];
  return <img alt={alt} ref={ref} src={src} decoding={decoding} width={width ?? info?.width} height={height ?? info?.height}
    srcSet={srcSet ?? (info ? info.width <= 640 ? `${encodeURI(src!)} ${info.width}w` : `${encodeURI(info.small)} 640w, ${encodeURI(src!)} ${info.width}w` : undefined)}
    sizes={sizes ?? (info ? '(max-width: 768px) 90vw, 480px' : undefined)} {...props} />;
});
