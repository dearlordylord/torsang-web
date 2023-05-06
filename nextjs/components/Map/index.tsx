import classes from './index.module.scss'

export const LocationMap = () => {

  return (
    <div className={classes.iframeWrapper}><iframe
      src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d1566.6034357193198!2d98.92410082410154!3d18.694954852706598!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTjCsDQxJzQxLjMiTiA5OMKwNTUnMjYuOCJF!5e0!3m2!1sen!2sth!4v1681047566945!5m2!1sen!2sth"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      height="450"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe></div>
  );
}
