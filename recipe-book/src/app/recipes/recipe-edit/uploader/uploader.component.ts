import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css'],
})
export class UploaderComponent implements OnInit {
  @Input() file: File;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  // bytesTransferred: number;
  // totalBytes: number;
  snapshot: Observable<any>;
  downloadURL: string;
  recipeForm: FormGroup;
  @Output() downloadUrlReady = new EventEmitter<string>();
  // @Input() isHovering;
  fileName: string;
  @Input() files: File[];

  constructor(private storage: AngularFireStorage,
              private db: AngularFirestore) {}

  ngOnInit() {
    this.startUpload();
  }

  /**
   * Starts the upload process for the selected file.
   */
  startUpload() {
    console.log(`this.file.name: ${this.file.name}`);

    this.fileName = `${Date.now()}_${this.file.name}`
    // The storage path
    const path = `recipes/${this.fileName}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, this.file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot = this.task.snapshotChanges().pipe(
      tap(console.log), // tap into the stream,
      // The file's download URL
      finalize(async () => { // finalize is called when the task is complete, this is where we would update our database
        this.downloadURL = await ref.getDownloadURL().toPromise();

         console.log(`============================><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<! downloadURL: ${this.downloadURL}`)

        this.db.collection('files').add( { downloadURL: this.downloadURL, path });
        
        this.downloadUrlReady.emit(this.downloadURL);
      }),
    );
  }

  onPause() {
    console.log(`============================================`);
    this.snapshot = this.task.snapshotChanges().pipe(
      tap(console.log));
      this.task.pause();
  }

  onResume() {
    this.task.resume();
    // The storage path
    const path = `recipes/${this.fileName}`;

    const ref = this.storage.ref(path);

    this.snapshot = this.task.snapshotChanges().pipe(
      tap(console.log),
      finalize(async() => {
        this.downloadURL = await ref.getDownloadURL().toPromise()
        this.downloadUrlReady.emit(this.downloadURL);
      }));
  }

  onCancel() {
    this.snapshot = this.task.snapshotChanges().pipe(
      tap(console.log));
    this.task.cancel();
    this.percentage = null;
    this.files = [];
  }

  /**
   * Deletes the attachment file.
   */
  deleteAttachment() {
    console.log(`files ====================////>: ${this.files}`);
    const path = `recipes/${this.fileName}`; // Path to the file you want to delete
    this.downloadURL = '';
    // this.snapshot = this.task.snapshotChanges().pipe(
    //   tap(console.log)), 
    //   finalize(async() => {
    //     this.downloadURL = '';
    //     this.db.collection('files').doc(path).delete();
    //     this.storage.ref(path).delete();
    //     this.downloadUrlReady.emit(this.downloadURL);
    // });
    this.snapshot = null;
    this.percentage = null;
    this.task = null;
    // this.isHovering = false;
    this.files = [];

    this.storage.ref(path).delete();
    
    this.downloadUrlReady.emit(this.downloadURL);
    console.log('File deleted successfully!');
  }

  /**
   * Checks if the upload snapshot is active.
   * @param {any} snapshot - The upload snapshot.
   * @returns {boolean} - True if the snapshot is active, false otherwise.
   */
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }
}