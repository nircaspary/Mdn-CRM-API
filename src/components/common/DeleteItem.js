import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router';
import Swal from 'sweetalert2';
import auth from '../../models/Auth';
import * as Http from '../../models/Http';

const DeleteItem = (props) => {
  const location = useLocation().pathname.split('/')[2];

  const params = useParams().id;

  const deleteItem = async () => {
    if (params !== 'me') await Http.deleteItem(`${location}/${params}`);
    else await Http.deleteItem(`users/${auth.user().id}`);
  };
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: { confirmButton: 'ui button red', cancelButton: 'ui button' },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        deleteItem();
        swalWithBootstrapButtons.fire('Deleted!', 'Your user has been deleted.', 'success');
        if (params !== 'me') props.history.replace('/admins/users');
        else {
          auth.logout();
          window.location.replace('/');
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire('Cancelled', 'Your user is safe :)', 'error');
        props.history.replace('/admins/users');
      }
    });
  return null;
};
export default DeleteItem;
