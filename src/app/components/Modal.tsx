declare global {
  interface Window {
    my_modal: any;
  }
}

export default function Modal({ children }: { children: any }) {
  return (
    <>
      <button
        className="btn"
        onClick={() => window.my_modal.showModal()}
      ></button>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <form method="dialog" className="modal-box">
          {children}
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </div>
        </form>
      </dialog>
    </>
  );
}
